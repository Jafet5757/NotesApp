const User = require('../db/models/user')
const Message = require('../db/models/message')
const { v4: uuidv4 } = require('uuid');
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

/**
 * Guarda un nuevo mensaje en la base de datos
 * @param {Object} req userId Id del usuario con el que se quiere obtener la conversación, message Mensaje a enviar
 * @param {Object} res 	
 * @returns Error en caso de que lo haya
 */
actions.sendMessage = async (req, res) => { 
  const { userId, message } = req.body
  const { id } = req.user
  try {
    // Verificamos que el mensaje no esté vacio y sean caracteres simples con una expresion regular
    if (!message || !message.match(/^[a-zA-Z0-9 ]*$/)) {
      return res.json({ message: 'El mensaje no es válido', error:true })
    }
    // Buscamos si ya hay algún registro de conversación entre los dos usuarios
    const conversation = await Message.findOne({
      $or: [
        { sender: id, receiver: userId },
        { sender: userId, receiver: id }
      ]
    })
    // Si no hay registro de conversación creamos uno nuevo con un nuevo id
    const newMessage = new Message({
      sender: id,
      receiver: userId,
      message,
      conversation: conversation ? conversation.conversation : uuidv4()
    })
    await newMessage.save()
    return res.json({error:false})
  } catch (error) {
    console.error(error)
    return res.json({ message: 'Ocurrió un error inseperado', error:true })
  }
}

module.exports = actions