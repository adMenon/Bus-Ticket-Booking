const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    PhoneNumber:{
        type:String,
        required:true,
        match: /^$|^\d{10}$/ 
    },
    Password:{
        type: String,
        required:true
    },
    isAdmin:{
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', UserSchema);