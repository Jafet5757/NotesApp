const mongoose = require('mongoose');
const { Schema } = mongoose;

// Modelo de una etiqueta
const tagSchema = new Schema({
  tag: { type: String },
  color: { type: String, default: 'purple' },
  user: { type: String }
})

module.exports = mongoose.model('tags', tagSchema);