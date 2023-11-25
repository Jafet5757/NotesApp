const router = require('express').Router()
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
 * @name GET/register
 * @description Render register view
 * @path {GET} /register
 * @response Render register view
 */
router.get('/register', (req, res) => {
  res.render('register')
})

module.exports = router