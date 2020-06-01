const mongoose = require('mongoose');
// var uniqueValidator = require('mongoose-unique-validator');

const PassengerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    gender: {
        type:String,
        required:true
    },
    age: {
        type:Number,
        required:true
    }
});

// UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Passenger', PassengerSchema);