const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        require: [true, 'Please enter your first name']
    },
    lastName: {
        type: String,
        require: [true, 'Please enter your last name']
    },
    email: {
        type: String,
        require: [true, 'Please enter an email']
    },
    password: {
        type: String,
        require: [true, 'Please enter a password']
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema);