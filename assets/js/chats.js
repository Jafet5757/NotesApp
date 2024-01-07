const principalCard = document.getElementById('principal-card-messages')
const socket = io();


(() => {
  // Hacemos una peticion fetch para obtener todos los usuasrios
  fetch('/chat/users')
    .then(response => response.json())
    .then(data => {
      // Si hay un error se muestra un mensaje
      if (data.error) {
        return Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: data.message
        })
      }
      // Obtenemos la lista de usuarios
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
    .catch(err => {
      console.error(err)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo salió mal'
      }) 
    })
})()

const thisUserMessage = (message) => {
  return `<div class="d-flex justify-content-end my-1">
            <div class="card bg-purple text-white">
              <div class="card-body">
                <p class="card-text">${message}</p>
              </div>
            </div>
          </div>`}

const otherUserMessage = (message) => {
  return `<div class="d-flex justify-content-start my-1">
            <div class="card bg-secondary text-white">
              <div class="card-body">
                <p class="card-text">${message}</p>
              </div>
            </div>
          </div>`}

const messageHasBeenRead = (read, position) => {
  // Agregamos el mensaje de leido
  return `<div class="text-end read-message d-flex justify-content-${position}">
            <label for="" class="text-${read?'primary':'secondary'}"><i class="bi bi-check-all"></i></label>
          </div>`
}

/**
 * Se carga la conversacion del usuario logueado con el usuario que se le pasa como parametro
 * @param {String} userId Id del usuario con el que se quiere obtener la conversación
 */
function loadConversation(userId) {
  // Hacemos una peticion fetch para obtener todos los mensajes
  const messagesCard = document.getElementById('messages-card')
  fetch('/chat/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId })
  })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      // Si hay un error se muestra un mensaje
      if (data.error) {
        return Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: data.message
        })
      }
      // Limpiamos los mensajes
      messagesCard.innerHTML = ''
      // Recorremos los mensajes y los agregamos a la lista
      data.messages.forEach(message => {
        // Si el mensaje es del usuario logueado lo agregamos a la derecha
        if (message.sender === data.users.id) {
          messagesCard.innerHTML += thisUserMessage(message.message)
          // Si el mensaje fue leido agregamos el icono
          messagesCard.innerHTML += messageHasBeenRead(message.read, 'end')
        } else {
          // Si el mensaje es del otro usuario lo agregamos a la izquierda
          messagesCard.innerHTML += otherUserMessage(message.message)
          // Si el mensaje fue leido agregamos el icono
          messagesCard.innerHTML += messageHasBeenRead(message.read, 'start')
        }
      })
      // Agregamos userId al input hidden
      document.getElementById('userId').value = userId
      // Baja el scroll hasta el final
      principalCard.scrollTop = principalCard.scrollHeight;
      // Nos unimos a la sala
      joinRoom(userId)
      // Emitimos el leido a la sala
      readEmit(true)
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

// Agregamos el evento click al input de mensaje
const message = document.getElementById('text-messageToSend')
// Agregamos el evento click para enviar el mensaje
message.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      sendMessage();
      console.log('Enter')
    }
});

/**
 * Hace una peticion mediante el socket para unirse a una sala mandando el id del usuario logueado y el id del usuario con el que se quiere obtener la conversación
 * @param {String} userId Id del usuario con el que se quiere obtener la conversación
 */
function joinRoom(userId) {
  // Hacemos una peticion a /join para unirnos a la sala
  fetch('/chat/join-room', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId })
  })
    .then(response => response.json())
    .then(data => {
      // Si hay un error se muestra un mensaje
      if (data.error) {
        return Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: data.message
        })
      }
      // Emitimos un evento para que el cliente sepa a que sala se unió
      socket.emit('room:join', data)
      // Guardamos el id de la sala en el session storage
      sessionStorage.setItem('room', data.conversation)
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

function sendMessage() {
  // Obtenemos el id del usuario
  const userId = document.getElementById('userId').value
  console.log('sendMessage')
  const message = document.getElementById('text-messageToSend').value
  // Hacemos una peticion fetch para enviar el mensaje
  fetch('/chat/send-message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, message: message })
  })
    .then(response => response.json())
    .then(data => {
      // Si el mensaje se envio correctamente se limpia el input
      if (!data.error) {
        // Se agrega el mensaje a la lista
        const messagesCard = document.getElementById('messages-card')
        messagesCard.innerHTML += thisUserMessage(message)
        // Se agrega el leido al ultimo mensaje
        messagesCard.innerHTML += messageHasBeenRead(false, 'end')
        // Baja el scroll hasta el final
        principalCard.scrollTop = principalCard.scrollHeight;
        // Se limpia el input
        document.getElementById('text-messageToSend').value = ''
        // Emitimos el mensaje a la sala
        emitMessage(message, userId)
      }else{
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
    .catch(err => {
      console.error(err)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo salió mal al enviar el mensaje'
      })
    })
}

/**
 * Emite un mensaje mediante el socket a la sala
 * @param {String} message 	Mensajes que queremos enviar
 * @param {String} userId Id del otro usuario que participa en la conversasion
 */
function emitMessage(message, userId) {
  // Hacemos una peticion a /id para obtener el id del usuario logueado
  fetch('/id')
    .then(response => response.json())
    .then(data => {
      messageContent = {
        userId,
        id: data.id,
        message,
        conversation: sessionStorage.getItem('room')
      }
      console.log('message:send', messageContent)
      // Emitimos el mensaje a la sala
      socket.emit('message:send', messageContent)
    })
    .catch(err => {
      console.error(err)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo salió mal al enviar el mensaje'
      })
    })
}

/**
 * Actualizamos la base de datos para que el mensaje se marque como leido y emitimos el mensaje a la sala
 * @param {String} userId Id del usuario con el que se tiene la conversación 
 */
function readEmit(inBroadcast = false) {
  // Hacemos una peticion a /id para obtener el id del usuario logueado
  fetch('/id')
    .then(response => response.json())
    .then(dataId => { 
      console.log('message-read:id: ', dataId)
      fetch('/chat/message-read', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
        body: JSON.stringify({
          id: dataId.id,
          userId: document.getElementById('userId').value,
          conversation: sessionStorage.getItem('room')
      })
    })
      .then(response => response.json())
        .then(data => {
        // Si hay un error se muestra un mensaje
        if (data.error) {
          return Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data.message
          })
        }
        // Emitimos el mensaje a la sala
        socket.emit('message:read', { conversation: sessionStorage.getItem('room'), userId: document.getElementById('userId').value, id: dataId.id, inBroadcast })
      })
      .catch(err => {
        console.error(err)
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Algo salió mal al recibir el mensaje'
        })
      })
      })
    .catch(err => {
      console.error(err)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo salió mal al enviar el mensaje'
      })
    })
}

// Eventos del socket
socket.on('room:joined', (room) => {
  console.log('room:joined', room)
  // Lo guardamos en el session storage
  sessionStorage.setItem('room', room)
})

/**
 * Recibe un mensaje de la sala y lo agrega a la lista
 */
socket.on('message:sent', (data) => { 
  console.log('message:sent', data)
  if(data.userId !== document.getElementById('userId').value) {
    // Agrega el mensaje a la lista
    const messagesCard = document.getElementById('messages-card')
    messagesCard.innerHTML += otherUserMessage(data.message)
    // Baja el scroll hasta el final
    principalCard.scrollTop = principalCard.scrollHeight;
    // Se agrega el leido al ultimo mensaje en verdadero porque el mensaje lo envio el otro usuario
    messagesCard.innerHTML += messageHasBeenRead(true, 'start')
    // Emitimos el leido a la sala
    readEmit()
  } else {
    // No hace nada porque el mensaje ya se agregó (lo envió el usuario logueado)
  }
})

/**
 * Recibe el leido de la sala y lo agrega a la lista
 */
socket.on('message:read', (data) => {
  console.log('message:read', data)
  // Leemos el último leido y lo ponemos en true
  const read = document.getElementsByClassName('read-message')
  read[read.length - 1].innerHTML = `<label for="" class="text-${read?'primary':'secondary'}"><i class="bi bi-check-all"></i></label>`
})