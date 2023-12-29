const User = require('../db/models/user')
const actions = {}

actions.getUsers = async(req, res) => {
  try {
    const users = await User.find({})
    res.json({users, error:false})
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Ocurrió un error inseperado', error:true })
  }
}

module.exports = actions