const mongoose = require('mongoose');
const { Schema } = mongoose;

//Modelo de la nota
const tokenSchema = new Schema({
  token: { type: String, required: true },
  email: { type: String },
  createdAt: { type: Date, default: Date.now },
  valid: { type: Boolean, default: true }
})

module.exports = mongoose.model('tokens', tokenSchema);