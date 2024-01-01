const mongoose = require('mongoose');
const { Schema } = mongoose;

// Modelo de una etiqueta
const tagSchema = new Schema({
  tag: { type: String, required: true },
  color: { type: String, required: true, default: 'purple' },
  user: { type: String, required: true }
})

module.exports = mongoose.model('tags', tagSchema);