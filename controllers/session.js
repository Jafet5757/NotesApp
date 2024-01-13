const User = require('../db/models/user')
const Token = require('../db/models/token')
const nodeMailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
actions = {}
const SECRET_KEY = '^Gm^j!a!Wr$6cG6f5UnchKS'

/**
 * registra un nuevo usuario en la bd
 * @param {Object} req email, username, password
 * @param {Object} res
 * @returns error {boolean}, message {string}
 */
actions.register = async (req, res) => {
  const { email, username, password } = req.body
  // Expresión regular para validar el email
  const regex = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi
  
  // Validamos que los campos no estén vacíos
  if (!email || !username || !password || !regex.test(email)) {
    return res.json({
      error: true,
      message: 'Los datos son incorrectos'
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

const transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jafetkevin575@gmail.com',
    pass: 'rooo fvjp rpnf aysc'
  }
})

/**
 * Envia un correo con un código de recuperación después de verificar que el correo existe
 * @param {Object} req email al cual enviaremos el codigo de recuperación
 * @param {Object} res 
 * @returns Mensaje de error o de éxito
 */
actions.recoverAccount = async (req, res) => { 
  const { email } = req.body

  // Buscamos el correo en la bd
  try {
    exist = await User.findOne({ email })
    if (exist) {
      // Generamos los números aleatorios
      const numbers = generateNumbers();

      // Creamos el token con una expiración de 1 hora
      const token = jwt.sign({ numbers }, SECRET_KEY, { expiresIn: '1h' });

      // Creamos el objeto token
      const newToken = new Token({ token, email });
      await newToken.save();

      // Enviamos el código al correo
      const mailOptions = {
        from: 'jafetkevin575@gmail.com',
        to: email,
        subject: 'Recuperación de cuenta',
        text: `Tu código de recuperación es ${numbers}`
      }
      
      const info = await transporter.sendMail(mailOptions)

      return res.json({
        error: false,
        message: 'Correo enviado'
      })
    }else{
      return res.json({
        error: true,
        message: 'El correo no existe'
      })
    }
  } catch (err) {
    console.error(err)
    return res.json({
      error: true,
      message: 'Ocurrió un error al enviar el correo'
    })
  }
}

/**
 * Verifica que el código de recuperación sea correcto y genera una nueva contraseña
 * @param {Object} req email y código de recuperación
 * @param {Object} res 
 * @returns Validacion del código (token)
 */
actions.verifyCode = async (req, res) => { 
  const { email, code } = req.body
  
  try {
    // Buscamos el token en la bd
    tokenRecovered = await Token.findOne({ email, valid: true })
    if (tokenRecovered) {
      // Verificamos que el código sea correcto
      const verify = jwt.verify(tokenRecovered.token, SECRET_KEY)
      if (verify.numbers === code) {
        // Desactivamos el token
        tokenRecovered.valid = false
        await tokenRecovered.save()

        // Generamos el hash del email
        const newPass = generateNumbers()
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPass, salt);

        // Actualizamos la contraseña
        const user = await User.findOne({ email });
        user.password = hash;
        await user.save();

        return res.json({
          error: false,
          message: 'Código correcto',
          valid: true,
          newPass
        })
      }
    }
    // Actualizamos todos los tokens a false
    await Token.updateMany({ email }, { valid: false })

    return res.json({
      error: true,
      message: 'Código incorrecto',
      valid: false
    })
  } catch (err) {
    // Actualizamos todos los tokens a false
    await Token.updateMany({ email }, { valid: false })
    console.error(err)
    return res.json({
      error: true,
      message: 'Ocurrió un error al comprobar el código'
    })
  }
}

function generateNumbers() {
  // Genera 4 numeros aleatorios
  let numbers = ''
  for (let i = 0; i < 4; i++) {
    numbers += Math.floor(Math.random() * 10)
  }
  return numbers
}

/**
 * Cambia la contraseña del usuario
 * @param {Object} req password, passwordConfirm
 * @param {Object} res 
 * @returns Mensaje de error o de éxito
 */
actions.changePassword = async (req, res) => { 
  const { password, passwordConfirm } = req.body

  // Validamos que los campos no estén vacíos
  if (!password || !passwordConfirm) {
    return res.json({
      error: true,
      message: 'Todos los campos son requeridos'
    })
  }

  // Validamos que las contraseñas coincidan
  if (password !== passwordConfirm) {
    return res.json({
      error: true,
      message: 'Las contraseñas no coinciden'
    })
  }

  // Actualizamos la contraseña
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.findById(req.user.id);
    user.password = hash;
    await user.save();

    return res.json({
      error: false,
      message: 'Contraseña actualizada'
    })
  } catch (err) {
    console.error(err)
    return res.json({
      error: true,
      message: 'Ocurrió un error al actualizar la contraseña'
    })
  }
}

module.exports = actions