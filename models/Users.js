const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    login: { type: String, required: true, unique: true },
    role: { type: String, required: false },
    password: { type: String, required: true },
});

module.exports = model('Users', userSchema);
