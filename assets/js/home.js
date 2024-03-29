const createNoteButton = document.querySelector('#createNote-button');
const editNoteButton = document.querySelector('#editNote-button');

// Preparamos los textarea con MarkDown
const simpl = new SimpleMDE({
  element: document.getElementById("body"),
  spellChecker: false,
});
const simplEdited = new SimpleMDE({
  element: document.getElementById("body-edit"),
  spellChecker: false,
});

const getNotes = () => { 
  fetch('/notes/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
  .then(data => {
    if(!data.error){
      const notes = data.notes
      renderNotes(notes)
    } else {
      console.error(data)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: data.message
      })  
    }
  })
  .catch(err => {
    console.error(err)
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Algo salió mal'
    })  
  })
}
getNotes()

function stringTagsToObjects(tags, color = 'purple') {
  const tagsArray = tags.split(',')
  const tagsObjects = []
  for(let tag of tagsArray){
    tag = tag.trim()
    tag = { tag, color }
    tagsObjects.push(tag)
  }
  return tagsObjects
}

/**
 * Obtiene las notas de un usuario especifico con su id
 */
createNoteButton.addEventListener('click', () => { 
  //obtenemos la data
  const title = document.querySelector('#title').value;
  const body = simpl.value();
  const isPublic = document.querySelector('#isPublicCreate').checked;
  const tags = document.querySelector('#tags').value;
  //validamos los campos
  if(!title || !body){
    return Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Todos los campos son obligatorios y solo se permiten letras y números'
    })  
  }
  //hacemos la peticion fetch
  fetch('/notes/create', {
    method: 'POST',
    body: JSON.stringify({title, body, isPublic, tags}),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
  .then(data => {
    if(!data.error){
      Swal.fire({
        icon: 'success',
        title: 'Creada correctamente',
        text: 'La nota se creó correctamente'
      })  
      //creamos la nota en el dom
      const note = {
        _id: data.noteId,
        title,
        body,
        isPublic,
        tags: stringTagsToObjects(tags, 'purple')
      }
      renderNotes([note])
    } else {
      console.error(data)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: data.message
      })  
    }
  })
  .catch(err => {
    console.error(err)
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Algo salió mal'
    })  
  })
  //limpiamos los campos
  document.querySelector('#title').value = '';
  document.querySelector('#body').value = '';
  //cerramos el modal
  document.getElementById('btn-close').click();
})

function deleteNote(noteId) { 
  //hacemos la peticion fetch
  fetch('/notes/delete', {
    method: 'POST',
    body: JSON.stringify({noteId}),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
  .then(data => {
    if(!data.error){
      Swal.fire({
        icon: 'success',
        title: 'Eliminada correctamente',
        text: 'La nota se eliminó correctamente'
      })  
      //eliminamos la nota del dom
      const note = document.getElementById(noteId)
      note.parentNode.removeChild(note)
    } else {
      console.error(data)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: data.message
      })  
    }
  })
  .catch(err => {
    console.error(err)
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Algo salió mal'
    })  
  })
}

/**
 * Pinta las nota en el DOM
 * @param {Array} notes Arreglo con las notas que son objetos
 */
function renderNotes(notes) {
  console.log(notes)
  let template = ''
  notes.forEach(note => {
    //Preparamos las etiquetas
    let tags = ''
    note.tags.forEach(tag => {
      tags += `<span class="mx-1 badge bg-${tag.color}">${tag.tag}</span>`
    })
        template += `
          <div class="col" id="${note._id}">
            <div class="card note-card" style="height:100%">
              <div class="card-header">
                <h4>${note.title}</h4>
                <div class="tags">
                  ${tags}
                </div>
              </div>
              <div class="card-body">
                ${marked.parse(note.body)}
              </div>
              <div class="card-footer">
                <button class="btn btn-purple" data-bs-toggle="modal" data-bs-target="#editNote-modal" id="${'edit'+note._id}"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-outline-danger" onclick="deleteNote('${note._id}')"><i class="bi bi-trash"></i></button>
              </div>
            </div>
          </div>
        `
      })
  document.querySelector('#notes-container').innerHTML += template
  //agregamos los eventos a los botones de editar
  notes.forEach(note => {
    document.querySelector(`#${'edit'+note._id}`).addEventListener('click', () => {
      activateModal(note._id, note.body, note.title, note.isPublic, note.tags)
    })
  })
}

/**
 * cargar en el modal los datos de la nota a editar
 * @param {String} noteId Id de la nota a editar
 */
function activateModal(noteId, body, title, isPublic, tags) {
  document.querySelector('#title-edit').value = title;
  simplEdited.value(body);
  // Transformamos el array de objetos a un string
  let tagsString = ''
  tags.forEach(tag => {
    tagsString += tag.tag + ', '
  })
  // Eliminamos la ultima coma
  tagsString = tagsString.slice(0, -2)
  document.querySelector('#tags-edit').value = tagsString;
  document.querySelector('#noteId-edit').value = noteId;
  document.querySelector('#isPublicEdit').checked = !!isPublic?true:false;
}

editNoteButton.addEventListener('click', () => { 
  //obtenemos la data
  const title = document.querySelector('#title-edit').value;
  const body = simplEdited.value();
  const noteId = document.querySelector('#noteId-edit').value;
  const isPublic = document.querySelector('#isPublicEdit').checked;
  const tags = document.querySelector('#tags-edit').value;
  //hacemos la peticion fetch
  fetch('/notes/update', {
    method: 'POST',
    body: JSON.stringify({title, body, noteId, isPublic, tags}),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
  .then(data => {
    if(!data.error){
      Swal.fire({
        icon: 'success',
        title: 'Editada correctamente',
        text: 'La nota se editó correctamente'
      })  
      // Extraemos la create card col
      const createCard = document.getElementById('col-create-card')
      // Limpiamos el dom
      document.querySelector('#notes-container').innerHTML = ''
      // Agregamos la create card col
      document.querySelector('#notes-container').appendChild(createCard)
      // Obtenemos las notas
      getNotes()
      //cerramos el modal
      document.getElementById('btn-close-edit').click();
    } else {
      console.error(data)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: data.message
      })  
    }
  })
  .catch(err => {
    console.error(err)
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Algo salió mal'
    })  
  })
  //limpiamos los campos
  document.querySelector('#title-edit').value = '';
  document.querySelector('#body-edit').value = '';
  //cerramos el modal
  document.getElementById('btn-close-edit').click();
})