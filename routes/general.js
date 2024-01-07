const router = require('express').Router()
const passport = require('passport')
const actions = require('../controllers/session')
const Search = require('../controllers/search')

//Verifica si tene sesion activa
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.redirect('/')
}

const isAuthenticatedForLogin = (req, res, next) => { 
  if (req.isAuthenticated()) {
    return res.redirect('/home')
  }
  return next()
}


/**
 * @swagger
 * /:
 *   get:
 *     summary: La ruta principal del servidor
 *     description: Carga la vista principal del servidor
 *     tags:
 *       - General
 *     responses:
 *       200:
 *        description: Vista cargada exitosamente
 */
router.get('/', (req, res) => {
  res.render('index')
})


/**
 * @swagger
 * /login:
 *   get:
 *     summary: Muestra la página de inicio de sesión
 *     description: Redirige al usuario a la página de inicio de sesión.
 *     tags:
 *       - Autenticación
 *     responses:
 *       '200':
 *         description: OK
 */
router.get('/login', isAuthenticatedForLogin, (req, res) => {
  res.render('login')
})


/**
 * @swagger
 * /login:
 *   post:
 *     summary: Inicia sesión en la aplicación
 *     description: Autentica al usuario y redirige a la página de inicio en caso de éxito, o a la página de inicio de sesión en caso de error.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       description: Credenciales del usuario
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Inicio de sesión exitoso
 *       '401':
 *         description: Inicio de sesión fallido
 */
router.post('/login', passport.authenticate('local-signin', {
  successRedirect: '/home',
  failureRedirect: '/login',
  passReqToCallback: true
}))


/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Cierra la sesión del usuario
 *     description: Desconecta al usuario y redirige a la página de inicio.
 *     tags:
 *       - Autenticación
 *     responses:
 *       '200':
 *         description: Desconexión exitosa
 *       '500':
 *         description: Error al desconectar
 */
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if(err){
      return next(err)
    }
    return res.redirect("/")
  })
})


/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registra un nuevo usuario en la base de datos
 *     description: Crea un nuevo usuario con el email, nombre de usuario y contraseña proporcionados.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       description: Datos del nuevo usuario
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Usuario creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       '400':
 *         description: Todos los campos son requeridos / El usuario ya existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.post('/register', actions.register)


/**
 * @swagger
 * /register:
 *   get:
 *     summary: Muestra la página de registro
 *     description: Redirige al usuario a la página de registro.
 *     tags:
 *       - Autenticación
 *     responses:
 *       '200':
 *         description: OK
 */
router.get('/register', (req, res) => {
  res.render('register')
})

/**
 * @swagger
 * /home:
 *   get:
 *     summary: Muestra la página de inicio
 *     tags:
 *       - General
 *     responses:
 *       '200':
 *         description: OK
 */
router.get('/home', isAuthenticated, (req, res) => {
  res.render('home', { user: req.user })
})

/**
 * @swagger
 * /publicNotes:
 *   get:
 *     summary: Muestra la página de notas públicas
 *     tags:
 *       - General
 *     responses:
 *       '200':
 *         description: OK
 */
router.get('/publicNotes', (req, res) => {
  res.render('publicNotes')
})

/**
 * @swagger
 * /chat:
 *   get:
 *     summary: Muestra la página de chat
 *     tags:
 *       - General
 *     responses:
 *       '200':
 *         description: OK
 */
router.get('/chat', isAuthenticated, (req, res) => { 
  res.render('chats')
})

/**
 * @swagger
 * /id:
 *   get:
 *     summary: Devuelve el ID del usuario autenticado
 *     tags:
 *       - General
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 */
router.get('/id', isAuthenticated, (req, res) => { 
  res.json({id: req.user.id})
})

/**
 * @swagger
 * /recoverAccount:
 *   get:
 *     summary: Muestra la página de recuperación de cuenta
 *     tags:
 *       - General
 *     responses:
 *       '200':
 *         description: OK
 */
router.get('/recoverAccount', (req, res) => { 
  res.render('recoverAccount')
})

/**
 * @swagger
 * /recoverAccount:
 *   post:
 *     summary: Envia un correo con un código de recuperación después de verificar que el correo existe
 *     description: Genera un código de recuperación y lo envía al correo proporcionado si existe en la base de datos.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       description: Correo electrónico para la recuperación de la cuenta
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Correo enviado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       '500':
 *         description: Ocurrió un error al enviar el correo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.post('/recoverAccount', actions.recoverAccount)


/**
 * @swagger
 * /verifyCode:
 *   post:
 *     summary: Verifica que el código de recuperación sea correcto y genera una nueva contraseña
 *     description: Comprueba el código de recuperación y, si es correcto, genera una nueva contraseña.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       description: Correo electrónico y código de recuperación
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Código correcto / Código incorrecto / Ocurrió un error al comprobar el código
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 valid:
 *                   type: boolean
 *                 newPass:
 *                   type: string
 */
router.post('/verifyCode', actions.verifyCode)

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Muestra el perfil del usuario
 *     description: Renderiza la vista del perfil del usuario si está autenticado.
 *     tags:
 *       - Usuario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Perfil del usuario
 */
router.get('/profile', isAuthenticated, (req, res) => { 
  res.render('profile')
})

/**
 * @swagger
 * /changePassword:
 *   post:
 *     summary: Cambia la contraseña del usuario
 *     description: Actualiza la contraseña del usuario después de validar que los campos no estén vacíos y que las contraseñas coincidan.
 *     tags:
 *       - Usuario
 *     requestBody:
 *       description: Nueva contraseña y confirmación de la contraseña
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               passwordConfirm:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Contraseña actualizada / Todos los campos son requeridos / Las contraseñas no coinciden / Ocurrió un error al actualizar la contraseña
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.post('/changePassword', actions.changePassword)

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Hace una búsqueda de la palabra en la web y en la base de datos
 *     description: Realiza una búsqueda en la web y en la base de datos basándose en la palabra clave proporcionada.
 *     tags:
 *       - Búsqueda
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: true
 *         description: Palabra clave para la búsqueda
 *     responses:
 *       '200':
 *         description: Resultados de la búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultados:
 *                   type: array
 *                   items:
 *                     type: object
 *                 notes:
 *                   type: array
 *                   items:
 *                     type: object
 *                 search:
 *                   type: string
 *                 login:
 *                   type: boolean
 */
router.get('/search', Search.search)

module.exports = router