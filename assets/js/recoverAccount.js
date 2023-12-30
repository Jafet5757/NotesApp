const verifyButton = document.getElementById('verify-button');
const sendCodeButton = document.getElementById('sendCode-button');

sendCodeButton.addEventListener('click', () => { 
  const email = document.getElementById('email').value;

  // Hacemos una peticion a la ruta /recoverAccount
  fetch('/recoverAccount', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        return Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message
        })
      }
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: data.message
      })
    })
    .catch(err => {
      console.log(err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al enviar el correo'
      })
    })
})


verifyButton.addEventListener('click', () => { 
  const code = document.getElementById('code').value;
  const email = document.getElementById('email').value;

  // Hacemos una peticion a la ruta /verifyCode
  fetch('/verifyCode', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code, email })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        return Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message
        })
      }
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: data.message+' Tu nueva contraseña es: '+data.newPass+' Recuerda cambiarla en la sección de perfil'
      })
    })
    .catch(err => {
      console.log(err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al verificar el código'
      })
    })
})