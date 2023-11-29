const createNoteButton = document.querySelector('#createNote-button');

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
      let template = ''
      notes.forEach(note => {
        template += `
          <div class="col">
            <div class="card note-card" style="height:100%">
              <div class="card-header">
                <h4>${note.title}</h4>
              </div>
              <div class="card-body">
                <p>${note.body}</p>
              </div>
              <div class="card-footer">
                <button class="btn btn-purple"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-outline-danger"><i class="bi bi-trash"></i></button>
              </div>
            </div>
          </div>
        `
      })
      document.querySelector('#notes-container').innerHTML += template
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