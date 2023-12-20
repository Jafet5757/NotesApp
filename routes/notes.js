const router = require('express').Router()
const actions = require('../controllers/note')

//Verifica si tene sesion activa
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.redirect('/')
}

/**
 * @swagger
 * /api/get:
 *   post:
 *     summary: Obtener notas de un usuario
 *     description: Obtener las notas asociadas al ID de usuario proporcionado
 *     tags:
 *       - Notas
 *     parameters:
 *       - in: body
 *         name: usuario
 *         description: ID del usuario
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *               description: ID del usuario
 *     responses:
 *       200:
 *         description: Notas obtenidas exitosamente
 *       400:
 *         description: Solicitud incorrecta
 *       500:
 *         description: Error del servidor
 */
router.post('/get',isAuthenticated, actions.getNotesFromAuser)


/**
 * @swagger
 * /api/create:
 *   post:
 *     summary: Crea una nueva nota
 *     description: Crea una nueva nota utilizando el título y el cuerpo proporcionados
 *     tags:
 *       - Notas
 *     parameters:
 *       - in: body
 *         name: nota
 *         description: Datos de la nueva nota
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               description: Título de la nota
 *             body:
 *               type: string
 *               description: Cuerpo de la nota
 *     responses:
 *       201:
 *         description: Nota creada exitosamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post('/create', isAuthenticated, actions.createNote)


/**
 * @swagger
 * /api/delete:
 *   post:
 *     summary: Elimina una nota
 *     description: Elimina una nota utilizando el ID proporcionado
 *     tags:
 *       - Notas
 *     parameters:
 *       - in: body
 *         name: nota
 *         description: ID de la nota
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             noteId:
 *               type: string
 *               description: ID de la nota
 *     responses:
 *       200:
 *         description: Nota eliminada exitosamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post('/delete', isAuthenticated, actions.deleteNote)


/**
 * @swagger
 * /api/update:
 *   post:
 *     summary: Actualiza una nota
 *     description: Actualiza una nota utilizando el ID proporcionado
 *     tags:
 *       - Notas
 *     parameters:
 *       - in: body
 *         name: nota
 *         description: ID de la nota
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             noteId:
 *               type: string
 *               description: ID de la nota
 *     responses:
 *       200:
 *         description: Nota actualizada exitosamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post('/update', isAuthenticated, actions.updateNote)

module.exports = router