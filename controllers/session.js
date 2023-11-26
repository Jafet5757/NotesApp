const User = require('../db/models/user')
actions = {}

actions.login = async (req, res) => {
  const { email, username, password } = req.body
  console.log(req.body);
  return res.json({message: 'Hola'})
}

module.exports = actions