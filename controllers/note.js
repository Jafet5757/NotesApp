const Note = require('../db/models/note')
actions = {}

/**
 * Obtiene las notas de un usuario especifico con su id
 * @param {Object} req id del usuario
 * @param {*} res 
 * @returns Mensaje de confirmación
 */
actions.getNotesFromAuser = async (req, res) => {
  try {
    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'})
    res.json({notes, error:false})
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Ocurrió un error', error:true })
  }
}

/**
 * Crea una nueva nota
 * @param {Object} req Titulo y cuerpo de la nota
 * @param {*} res 
 * @returns Mensaje de confirmación
 */
actions.createNote = async (req, res) => { 
  const { title, body } = req.body
  try {
    const newNote = new Note({
      title,
      body,
      user: req.user.id
    })
    await newNote.save()
    res.json({ message: 'Note saved', error:false })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Ocurrió un error', error:true })
  }
}

module.exports = actions