const createNoteButton = document.querySelector('#createNote-button');
const editNoteButton = document.querySelector('#editNote-button');

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

/**
 * Obtiene las notas de un usuario especifico con su id
 */
createNoteButton.addEventListener('click', () => { 
  //obtenemos la data
  const title = document.querySelector('#title').value;
  const body = document.querySelector('#body').value;
  //hacemos la peticion fetch
  fetch('/notes/create', {
    method: 'POST',
    body: JSON.stringify({title, body}),
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
        body
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
  let template = ''
      notes.forEach(note => {
        template += `
          <div class="col" id="${note._id}">
            <div class="card note-card" style="height:100%">
              <div class="card-header">
                <h4>${note.title}</h4>
              </div>
              <div class="card-body">
                <p>${note.body}</p>
              </div>
              <div class="card-footer">
                <button class="btn btn-purple" data-bs-toggle="modal" data-bs-target="#editNote-modal" onclick="activateModal('${note._id}', '${note.body}', '${note.title}')"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-outline-danger" onclick="deleteNote('${note._id}')"><i class="bi bi-trash"></i></button>
              </div>
            </div>
          </div>
        `
      })
      document.querySelector('#notes-container').innerHTML += template
}

/**
 * cargar en el modal los datos de la nota a editar
 * @param {String} noteId Id de la nota a editar
 */
function activateModal(noteId, body, title) {
  document.querySelector('#title-edit').value = title;
  document.querySelector('#body-edit').value = body;
  document.querySelector('#noteId-edit').value = noteId;
}

editNoteButton.addEventListener('click', () => { 
  //obtenemos la data
  const title = document.querySelector('#title-edit').value;
  const body = document.querySelector('#body-edit').value;
  const noteId = document.querySelector('#noteId-edit').value;
  //hacemos la peticion fetch
  fetch('/notes/update', {
    method: 'POST',
    body: JSON.stringify({title, body, noteId}),
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
      //editamos la nota en el dom
      const note = document.getElementById(noteId)
      note.querySelector('.card-header h4').textContent = title
      note.querySelector('.card-body p').textContent = body
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