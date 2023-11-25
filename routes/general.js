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

module.exports = router