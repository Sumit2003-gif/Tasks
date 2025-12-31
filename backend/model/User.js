const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please Add a Name"],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please add a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },

   
    bio: {
        type: String,
        maxlength: [160, "Bio 160 characters se zyada nahi ho sakti"],
        default: "Hey there! I'm using Task Manager."
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        default: ""
    },
    
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    }

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);