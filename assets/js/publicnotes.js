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
              </div>
            </div>
          </div>
        `
      })
      document.querySelector('#notes-container').innerHTML += template
}

const getNotes = () => { 
  fetch('/notes/public')
    .then(res => res.json())
    .then(data => {
      if(!data.error){
        renderNotes(data.notes)
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