const btnChangePassword = document.querySelector('#btnChangePassword');

btnChangePassword.addEventListener('click', () => { 
  const password = document.querySelector('#password');
  const passwordConfirm = document.querySelector('#confirmPassword');

  if (password.value !== passwordConfirm.value) {
    return Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Las contraseñas no coinciden'
    })
  }

  // Hacemos la petición
  fetch('/changePassword', {
    method: 'POST',
    body: JSON.stringify({
      password: password.value,
      passwordConfirm: passwordConfirm.value
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        return Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.message
        })
      }

      Swal.fire({
        icon: 'success',
        title: 'Contraseña actualizada'
      })
    })
    .catch(err => {
      console.error(err)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ocurrió un error'
      })
    })
});