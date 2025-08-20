const mongoose = require('mongoose')

const Access = new mongoose.Schema({
    email: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    role: {
        type: mongoose.Schema.Types.String,
        required: true
    },

})

const AccessSchema = mongoose.model("UsersAccessDoc", Access);
module.exports = AccessSchema;