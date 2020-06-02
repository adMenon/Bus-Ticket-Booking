const express = require('express');
const uniqid = require('uniqid');
const router = express.Router();

const Bus = require("../models/bus");



router.get('/showOpen', async(req, res)=>{
    console.log(req);
    if(req.query.BusID==undefined)
    {
        console.log("BusId invalid");
        return res.status(400).json({Message:"BusID invalid"});
    }
    try{
        const seatDetails = await Bus.find({BusID:req.query.BusID, isBooked:false}).select({seatNo:1, _id:0});
        res.status(200).json({"Open Seats":seatDetails});
    }
    catch(err){
        res.status(500).json({Error:err});
        throw err;
    }
});
router.get('/showClosed', async(req, res)=>{
    console.log(req.query.BusID);
    if(req.query.BusID==undefined)
    {
        console.log("BusId invalid");
        return res.status(400).json({Message:"BusID invalid"});
    }
    try{
        
        const seatDetails = await Bus.find({BusID:req.query.BusID, isBooked:true}).select({seatNo:1, _id:0});
        res.status(200).json({"Closed Seats":seatDetails});
    }
    catch(err){
        res.status(500).json({Error:err});
        throw err;
        
    }
})


router.post('/book',async(req,res)=>{

    console.log(req.body);
    try{
        var tickets = [];
        var Booking = req.body.booking;
        var BId = uniqid();
        if(req.body.BusID==undefined || req.body.Booking==undefined )
        {
            console.log("input invalid");
            return res.status(400).json({Message:"input invalid"});
        }
        const seatDetails = await Bus.find({BusID:req.body.BusID}).select({isBooked:1, _id:0})
        console.log(seatDetails);
        if(seatDetails.length==0){
            console.log("seats not available");
            res.status(404).json({Message:"seats not available"});
        }
        await Promise.all(Booking.map(async(element) => {
            if(element.seatNo>seatDetails.length){
                console.log(new Error("Invalid seat"));
                return res.status(400).json({Message:"Invalid Seat"});
            }
            else if(seatDetails[element.seatNo-1].isBooked){
                console.log("seat not available");
                return res.status(404).json({Message:"seat not available"});
            }
            const PassengerDetails = element.Passenger;
            const updateBus = await Bus.findOneAndUpdate({BusID : req.body.BusID, seatNo : element.seatNo},
                {"$set":{
                            isBooked:true,
                            PassengerName:PassengerDetails.Name,
                            PassengerAge: PassengerDetails.Age,
                            PassengerGender: PassengerDetails.Gender,
                            BookingID:BId,
                            DateOfBooking: Date.now,
                            BookedBy: {"email":req.UserData.email,"PhoneNumber":req.UserData.PhoneNumber}
                        }
                },
                {new:true});
            console.log(updateBus);
            tickets.push(updateBus); 
        }));
        res.status(200).json(tickets);
    }catch(err){
        res.status(500).json({Message:err});
        throw err;
    }
});


module.exports = router;