const router = require('express').Router()
const chat = require('../controllers/chat')

router.get('/users', chat.getUsers)

module.exports = router