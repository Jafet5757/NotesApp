const User = require('../db/models/user')
const Message = require('../db/models/message')
const actions = {}

/**
 * Obtiene todods los usuarios registrados en la bd
 * @param {Object} req 
 * @param {Object} res 
 * @returns Lista de usuarios
 */
actions.getUsers = async(req, res) => {
  try {
    const users = await User.find({})
    return res.json({users, error:false})
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Ocurrió un error inseperado', error:true })
  }
}

/**
 * Obtiene todos los mensajes entre dos usuarios
 * @param {Object} req id del usuario con el que se quiere obtener la conversación
 * @param {Object} res 
 * @returns Mensajes donde han participado el usuario logueado y el usuario con el que se quiere obtener la conversación
 */
actions.getMessages = async (req, res) => {
  const { userId } = req.body// id del otro usuario
  const { id } = req.user// id del usuario logueado
  try {
    const messages = await Message.find({
      $or: [
        { sender: id, receiver: userId },
        { sender: userId, receiver: id }
      ]
    })
    res.json({ messages, users: {userId, id}, error:false})
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Ocurrió un error inseperado', error:true })
  }
}

actions.sendMessage = async (req, res) => { 
  const { userId, message } = req.body
  const { id } = req.user
  try {
    const newMessage = new Message({
      sender: id,
      receiver: userId,
      message
    })
    await newMessage.save()
    return res.json({error:false})
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Ocurrió un error inseperado', error:true })
  }
}

module.exports = actions