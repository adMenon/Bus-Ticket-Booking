const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Bus = require("../models/bus");


router.post('/viewTicket',async (req,res)=>{
    try{
        var bookingId = req.body.bookingId;
        var phoneNumber = req.body.phoneNumber;
        
        const getTickets = await Bus.find({BookingId:bookingId, PhoneNumber: phoneNumber}).populate('PassengerDetails');
        console.log(getTickets);
        if(getTickets.length==0){
            res.send("No tickets found");
        }
        res.json(getTickets);
    }
    catch(err){
        res.send("err");
        throw err;
    }
});
router.delete('/deleteTicket', async (req,res)=>{
    try{
        console.log(req.body);
        var bookingId = req.body.bookingId;
        var seats = req.body.seats;
        var busId = req.body.busId;
        

        
        const updateBus = await Bus.updateMany({BusID:busId,Booking_ID:bookingId, seatNo: {$in : seats}},
            {"$set":{isBooked:false}, "$unset":{PassengerDetails:1, BookingID:1, PhoneNumber:1, DateOfBooking:1}});
        console.log(updateBus);
        res.json(updateBus);
    }
    catch(err){
        res.send("err");
        throw err;
    }
});
module.exports = router;