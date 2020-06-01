const mongoose = require("mongoose");
const Passenger = require('./Passenger');

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
        type:mongoose.Schema.Types.ObjectId,
        ref:'Passenger'
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