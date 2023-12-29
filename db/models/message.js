const mongoose = require('mongoose');
const { Schema } = mongoose;

// Modelo de un mensaje
const messageSchema = new Schema({
  message: {type: String, required: true},
  date: {type: Date, default: Date.now},
  sender: { type: String },
  receiver: { type: String },
  read: { type: Boolean, default: false },
  conversation: { type: String, required: true }
})

module.exports = mongoose.model('messages', messageSchema);