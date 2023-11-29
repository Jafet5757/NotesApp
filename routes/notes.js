const router = require('express').Router()
const actions = require('../controllers/note')

//Verifica si tene sesion activa
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.redirect('/')
}

router.post('/get',isAuthenticated, actions.getNotesFromAuser)

router.post('/create', isAuthenticated, actions.createNote)

router.post('/delete', isAuthenticated, actions.deleteNote)

module.exports = router