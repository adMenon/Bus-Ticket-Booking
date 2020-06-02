const mongoose = require("mongoose");

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
    PassengerName:{
        type:Object
    },
    PassengerAge:{
        type:Number
    },
    PassengerGender:{
        type:String
    },
    BookingID:{
        type: String
    },
    DateofBooking:{
        type: Date
    },
    BookedBy:{
        type:Object
    }
});

module.exports = mongoose.model('Bus', BusSchema);