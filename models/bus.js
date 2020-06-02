const mongoose = require("mongoose");
const User = require('./user');

const BusSchema = mongoose.Schema({
    BusID:{
        type: Number,
        required: true
    },
    seatNo:{
        type: Number,
        required: true
    },
    isBooked:{
        type : Boolean,
        default:false
    },
    PassengerDetails:{
        type:Object
    },
    BookingID:{
        type: String
    },
    PhoneNumber:{
        type: String,
    },
    DateofBooking:{
        type: Date,
    }
});

module.exports = mongoose.model('Bus', BusSchema);