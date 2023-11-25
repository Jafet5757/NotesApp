const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcryptjs')

//Modelo del usuario
const userSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
})

//Para cifrar la contraseña
userSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
}

//Compara la contraseña
userSchema.methods.matchPasswords = async function(password){
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('users', userSchema);