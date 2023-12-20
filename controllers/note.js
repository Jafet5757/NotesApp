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
  const { title, body, isPublic } = req.body
  try {
    const newNote = new Note({
      title,
      body,
      user: req.user.id,
      isPublic
    })
    await newNote.save()
    //Obtenemos su id para enviarlo al front
    const noteId = newNote._id
    res.json({ message: 'Note saved', error:false, noteId })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Ocurrió un error', error:true })
  }
}

/**
 * Elimina una nota y comprueba que pertenezca al usuario
 * @param {Object} req id de la nota y id del uuario
 * @param {*} res 
 * @returns menaje de confirmación
 */
actions.deleteNote = async (req, res) => { 
  const { noteId } = req.body
  const userId = req.user.id
  try {
    //Buscamos la nota
    const note = await Note.findById(noteId)
    //Verificamos que la nota exista y pertenezca al usuario
    if(!note || note.user != userId){
      return res.status(404).json({ message: 'Note not found', error:true })
    }
    //Eliminamos la nota
    await Note.findByIdAndDelete(noteId)
    res.json({ message: 'Note deleted', error:false })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Ocurrió un error', error:true })
  }
}

/**
 * Busca una nota y la edita
 * @param {Object} req id de la nota, titulo y cuerpo
 * @param {*} res 
 * @returns Menaje de confirmación
 */
actions.updateNote = async (req, res) => {
  const { noteId, title, body, isPublic } = req.body
  const userId = req.user.id
  try {
    //Buscamos la nota
    const note = await Note.findById(noteId)
    //Verificamos que la nota exista y pertenezca al usuario
    if(!note || note.user != userId){
      return res.status(404).json({ message: 'Note not found', error:true })
    }
    //Editamos la nota
    await Note.findByIdAndUpdate(noteId, { title, body, isPublic })
    return res.json({ message: 'Note edited', error:false })
  }catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Ocurrió un error', error:true })
  }
}

module.exports = actions