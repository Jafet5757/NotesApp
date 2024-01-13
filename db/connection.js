const mongoose = require('mongoose');

// Asegúrate de cambiar 'tu_base_de_datos' al nombre real de tu base de datos
const URI = process.env.MONGODB_URI ? process.env.MONGODB_URI : 'mongodb+srv://Bakery7965:' + encodeURIComponent('&y5v63t5^3us&q%&h') + '@notesappdb.mongocluster.cosmos.azure.com/tu_base_de_datos?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000';

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(db => console.log('DB is connected'))
  .catch(err => console.error(err))

module.exports = mongoose;
