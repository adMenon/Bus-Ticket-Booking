const express = require('express');
const router = express.Router();

const Bus = require("../models/bus");


router.post('/viewTicket',async (req,res)=>{
    if(req.query.BusID==undefined)
    {
        console.log("BusId invalid");
        return res.status(400).json({Message:"BusID invalid"});
    }
    try{
        var bookingID = req.body.bookingID;
        const getTickets = await Bus.find({BookingID:bookingID}).select({_id:0,__v:0});
        if(getTickets.length==0){
            console.log("No tickets found");
            return res.status(400).json({Message:"No tickets found"});
        }
        console.log(getTickets);
        res.status(200).json(getTickets);
    }
    catch(err){
        res.status(500).json({Error:err});
        throw err;
    }
});
router.patch('/deleteTicket', async (req,res)=>{
    try{
        console.log(req.body);
        var BookingID = req.body.BookingID;
        var seats = req.body.seats;
        var BusID = req.body.BusID;
        
        if(BusID==undefined || BookingID==undefined || seats==undefined )
        {
            console.log("input invalid");
            return res.status(400).json({Message:"input invalid"});
        }
    
        const updateBus = await Bus.updateMany({BusID:BusID,BookingID:BookingID, seatNo: {$in : seats}},
            {"$set":{isBooked:false},
             "$unset":{PassengerAge:1,
                PassengerName:1,
                PassengerGender:1,
                BookingID:1,
                PhoneNumber:1,
                DateOfBooking:1}
            });
        console.log(updateBus);
        if(updateBus.n==0){
            res.status(404).json({Message: "given seats dont match"});

        }
        res.status(200).json({Message:updateBus.n +" tickets cancelled"});
    }
    catch(err){
        res.status(500).json({Error:err});
        throw err;
    }
});
module.exports = router;