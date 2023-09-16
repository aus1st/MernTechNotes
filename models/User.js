const mongoose = require('mongoose');

const userSchme = new mongoose.Schema({
    userName: {
        type:String,
        required: true
    },
    password: {
        type:String,
        required: true
    },
    roles: [{
        type:String,
        default: 'Employee'
    }],
    isActive: {
        type:Boolean,
        default: true
    },
})

module.exports = mongoose.model('User',userSchme);