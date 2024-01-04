const axios = require('axios');
const cheerio = require('cheerio');
const Note = require('../db/models/note')
const marked = require('marked');
const actions = {}

actions.search = async(req, res) => {
  const { search } = req.query
  const id = req.user ? req.user.id : null

  try {
    // Realizar la búsqueda en la web
    const resultados = await searchInWeb(search);

    // Buscamos en la base de datos
    const notes = await searchNoteByTitle(search, id)

    // Convertimos el cuerpo de las notas a HTML
    await notes.forEach(note => {
      note.body = marked.parse(note.body)
    })

    // Renderizar la vista con los resultados
    return res.render('search', { resultados, notes, search, login: id ? true : false });
  }catch(error) {
    console.error(error)
    return res.render('search', { resultados: [], notes: [], search, login: id ? true : false });
  }
  
}

async function searchInWeb(terminoBusqueda) {
  try {
    // Realizar una solicitud HTTP a la página de búsqueda
    const respuesta = await axios.get(`https://www.bing.com/search?q=${terminoBusqueda}`);

    // Cargar el HTML de la página en Cheerio
    const $ = cheerio.load(respuesta.data);

    // Extraer información utilizando selectores de Cheerio
    const resultados = [];
    $('h2').each((index, elemento) => {
      // Agregar el texto de cada elemento encontrado al arreglo de resultados
      const title = $(elemento).text()
      // Obtenemos el enlace del elemento que es la etiqueta <a> hijo
      // del elemento <h2> actual
      const link = $(elemento).children().attr('href');
      resultados.push({ title, link });
    });
    
    // Eliminamos las busquedas donde no haya link
    const filteredResult = resultados.filter(result => result.link !== undefined)

    // Devolver los resultados
    return filteredResult;
  } catch (error) {
    console.error('Error al realizar la búsqueda:', error.message);
    return [];
  }
}

async function searchNoteByTitle(title, id='') {
  try {
    // Buscamos donde sea privada y del usuario
    const privateNotes = await Note.find({ isPublic: false, user: id, title: { $regex: title, $options: 'i' } }).sort({ date: 'desc' })
    // Buscamos donde sea publica sin importar el usuario
    const publicNotes = await Note.find({ isPublic: true, title: { $regex: title, $options: 'i' } }).sort({ date: 'desc' })
    return [...privateNotes, ...publicNotes]
  } catch (error) {
    console.error(error)
    return []
  }
}

module.exports = actions