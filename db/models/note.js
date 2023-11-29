const mongoose = require('mongoose');
const { Schema } = mongoose;

//Modelo de la nota
const noteSchema = new Schema({
    title: {type: String, required: true},
    body: {type: String, required: true},
    date: {type: Date, default: Date.now},
    user: { type: String },
    isPublic: {type: Boolean, default: false}
})

module.exports = mongoose.model('notes', noteSchema);