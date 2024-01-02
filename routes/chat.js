const router = require('express').Router()
const chat = require('../controllers/chat')

//Verifica si tene sesion activa
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.json({error:true, message:'No tienes permiso para acceder'})
}

router.get('/users', isAuthenticated, chat.getUsers)
router.post('/messages', isAuthenticated, chat.getMessages)
router.post('/send-message', isAuthenticated, chat.sendMessage)
router.post('/join-room', isAuthenticated, chat.joinRoom)

module.exports = router