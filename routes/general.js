const router = require('express').Router()
const passport = require('passport')
const actions = require('../controllers/session')

//Verifica si tene sesion activa
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.redirect('/')
}

/**
 * @module routes/general
 * @description General routes
 * @response Render index view
 */
router.get('/', (req, res) => {
  res.render('index')
})

/**
 * @name GET/login
 * @description Render login view
 * @path {GET} /login
 * @response Render login view
 */
router.get('/login', (req, res) => {
  res.render('login')
})

/**
 * @name POST/login
 * @description Login action
 * @path {POST} /login
 * @body {String} email - username
 * @body {String} password
 * @response error - Render login view
 */
router.post('/login', passport.authenticate('local-signin', {
  successRedirect: '/home',
  failureRedirect: '/login',
  passReqToCallback: true
}))

/**
 * @name GET/logut
 * @description Logout action
 * @path {GET} /logout
 * @response error - not load the server
 */
router.get('/logout', (req, res) => {
  req.logout((err) =>{
    if(err){
      return next(err)
    }
    return res.redirect("/")
  })
})

/**
 * @name POST/login
 * @description Login action
 * @path {POST} /login
 * @body {String} email
 * @body {String} password
 * @body {String} username
 * @body {String} password-confirm
 * @response error - Render login view
 */
router.post('/register', actions.register)

/**
 * @name GET/register
 * @description Render register view
 * @path {GET} /register
 * @response Render register view
 */
router.get('/register', (req, res) => {
  res.render('register')
})

router.get('/home', isAuthenticated, (req, res) => {
  res.render('home', { user: req.user })
})

router.get('/publicNotes', (req, res) => {
  res.render('publicNotes')
})

router.get('/chat', isAuthenticated, (req, res) => { 
  res.render('chats')
})

router.get('/id', isAuthenticated, (req, res) => { 
  res.json({id: req.user.id})
})

module.exports = router