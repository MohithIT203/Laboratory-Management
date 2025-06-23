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
        unique: true
    },
    role: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    refId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'role'
    }

})

const AccessSchema = mongoose.model("UsersAccess", Access);
module.exports = AccessSchema;