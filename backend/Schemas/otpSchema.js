const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    Slot_id: {
        type: String,
        required: true,
    },
    otp: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 10
    }
});

// Virtual field to check validity
otpSchema.virtual('isValid').get(function () {
    return (Date.now() - this.createdAt.getTime()) < 10000;
});

const Otp = mongoose.model("Otp", otpSchema);
module.exports = Otp;
