const loginButton = document.getElementById('login-button');

loginButton.addEventListener('click', (e) => { 
  e.preventDefault()
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value

  //hacemos una petición a la ruta /login
  fetch('./login', {
    method: 'POST',
    body: JSON.stringify({username, password}),
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
          title: '¡Login exitoso!',
          text: data.message
        })
        setTimeout(() => {
          window.location.href = '/'
        }, 500)
      }
    })
    .catch(err => {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ocurrió un error'
      })
  })
})