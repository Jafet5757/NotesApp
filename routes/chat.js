const router = require('express').Router()
const chat = require('../controllers/chat')

//Verifica si tiene sesión activa
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.json({error:true, message:'No tienes permiso para acceder'})
}

/**
 * @swagger
 * /chat/users:
 *   get:
 *     summary: Obtiene todos los usuarios registrados en la base de datos.
 *     description: Obtiene todos los usuarios registrados en la base de datos.
 *     tags:
 *      - Chat
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 */
router.get('/users', isAuthenticated, chat.getUsers)

/**
 * @swagger
 * /chat/messages:
 *   get:
 *     summary: Obtiene los mensajes entre dos usuarios.
 *     description: Obtiene los mensajes entre dos usuarios.
 *     tags:
 *       - Chat
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   sender:
 *                     type: string
 *                   receiver:
 *                     type: string
 *                   read:
 *                     type: boolean
 *                   conversation:
 *                     type: string
 */
router.post('/messages', isAuthenticated, chat.getMessages)

/**
 * @swagger
 * /chat/send-message:
 *   post:
 *     summary: Envía un mensaje en el chat.
 *     description: Permite a un usuario enviar un mensaje en el chat.
 *     tags:
 *       - Chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: boolean
 */
router.post('/send-message', isAuthenticated, chat.sendMessage)

/**
 * @swagger
 * /chat/join-room:
 *   post:
 *     summary: Se une a una sala de chat.
 *     description: Permite a un usuario unirse a una sala de chat.
 *     tags:
 *       - Chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 conversation:
 *                   type: string
 *                 error:
 *                   type: boolean
 */
router.post('/join-room', isAuthenticated, chat.joinRoom)

/**
 * @swagger
 * /message-read:
 *   post:
 *     summary: Actualiza el campo read de los mensajes a true
 *     description: Permite a un usuario marcar todos los mensajes de una conversación como leídos.
 *     tags:
 *       - Chat
 *     requestBody:
 *       description: ID del usuario que tiene la conversación y ID del otro usuario
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *       '500':
 *         description: Ocurrió un error inseperado
 */
router.post('/message-read', isAuthenticated, chat.readMessage)

module.exports = router