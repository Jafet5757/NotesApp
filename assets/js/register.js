const createAccount = document.getElementById('createAccount')

createAccount.addEventListener('click', (e) => { 
  e.preventDefault()
  const email = document.getElementById('email').value
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  const confirmPassword = document.getElementById('password-confirm').value

  if (password !== confirmPassword) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Las contraseñas no coinciden'
    })
    return
  }

  //hacemos una petición a la ruta /login
  fetch('/login', {
    method: 'POST',
    body: JSON.stringify({email, username, password}),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if (data.error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: data.message
        })
      } else {
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: data.message
        })
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      }
    })
    .catch(err => {
      console.log(err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ocurrió un error'
      })
    })
  
})

/* Swal.fire("SweetAlert2 is working!"); */