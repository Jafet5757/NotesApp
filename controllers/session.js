const User = require('../db/models/user')
actions = {}

/**
 * registra un nuevo usuario en la bd
 * @param {Object} req email, username, password
 * @param {Object} res
 * @returns error {boolean}, message {string}
 */
actions.register = async (req, res) => {
  const { email, username, password } = req.body
  
  // Validamos que los campos no estén vacíos
  if (!email || !username || !password) {
    return res.json({
      error: true,
      message: 'Todos los campos son requeridos'
    })
  }
  // Validamos que el usuario no exista
  const user = await User.findOne({ email })
  if (user) {
    return res.json({
      error: true,
      message: 'El usuario ya existe'
    })
  }
  // Creamos el usuario
  const newUser = new User({ email, username, password })
  newUser.password = await newUser.encryptPassword(password)
  await newUser.save()
  return res.json({
    error: false,
    message: 'Usuario creado'
  })
}

/**
 * Recibe un susuario y comprueba si existe en la bd, luyego lo redirecciona al home
 * @param {Object} req username, password
 * @param {Object} res 
 * @returns error {boolean}, message {string}
 */
actions.login = async(req, res) => {
  const { username, password } = req.body
  // Validamos que los campos no estén vacíos
  if (!username || !password) {
    return res.json({
      error: true,
      message: 'Todos los campos son requeridos'
    })
  }
  // Verificamos que está registrado
  const user = await User.findOne({ username })
  if (!user) {
    return res.json({
      error: true,
      message: 'El usuario no existe'
    })
  }
  // Verificamos que la contraseña sea correcta
  const match = await user.matchPassword(password)
  if (!match) {
    return res.json({
      error: true,
      message: 'Contraseña incorrecta'
    })
  }
}

module.exports = actions