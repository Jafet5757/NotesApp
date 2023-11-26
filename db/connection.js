const mongoose = require('mongoose');
const URI = process.env.MONGODB_URI ? process.env.MONGODB_URI : 'mongodb://127.0.0.1/notes-db';	

mongoose.connect(URI)
  .then(db => console.log('DB is connected'))
  .catch(err => console.error(err))

module.exports = mongoose