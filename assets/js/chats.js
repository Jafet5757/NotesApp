(() => {
  // Hacemos una peticion fetch para obtener todos los usuasrios
  fetch('/chat/users')
    .then(response => response.json())
    .then(data => {
      const listUsers = document.getElementById('list-users')
      // Limpia la lista de usuarios
      listUsers.innerHTML = ''
      // Recorremos los usuarios y los agregamos a la lista
      data.users.forEach(user => {
        const li = document.createElement('li')
        li.textContent = user.username
        // Agregamos un evento click a cada usuario pasandole su id
        li.addEventListener('click', () => loadConversation(user._id))
        // Agregamos su clase de bootstrap
        li.classList.add('list-group-item')
        listUsers.appendChild(li)
      })
    })
})()


function loadConversation(userId) {
  alert('Cargando conversación')
}