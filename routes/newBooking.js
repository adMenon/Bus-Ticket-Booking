const express = require('express');
const uniqid = require('uniqid');
const router = express.Router();

const Bus = require("../models/bus");



router.get('/showOpen', async(req, res)=>{
    console.log(req);
    if(req.query.BusID==undefined)
    {
        console.log("BusId invalid");
        res.json({Message:"BusID invalid"});
    }
    try{

        const seatDetails = await Bus.find({BusID:req.query.BusID, isBooked:false}).select({seatNo:1, _id:0});
        res.json({"Open Seats":seatDetails});
    }
    catch(err){
        res.json({"error":err});
        
    }
});
router.get('/showClosed', async(req, res)=>{
    console.log(req.query.BusID);
    if(req.query.BusID==undefined)
    {
        console.log("BusID invalid");
        res.json({Message:"BusID invalid"});
    }
    try{
        
        const seatDetails = await Bus.find({BusID:req.query.BusID, isBooked:true}).select({seatNo:1, _id:0});
        res.json({"Closed Seats":seatDetails});
    }
    catch(err){
        res.json({"error":err});
        
    }
})


router.post('/book',async(req,res)=>{

    console.log(req.body);
    try{
        var tickets = [];
        var Booking = req.body.booking;
        var BId = uniqid();
        if(req.body.BusID==undefined)
        {
            console.log("BusId invalid");
            res.json({Message:"BusID invalid"});
        }
        const seatDetails = await Bus.find({BusID:req.body.BusID}).select({isBooked:1, _id:0})
        console.log(seatDetails);
        if(seatDetails.length==0){
            console.log("No seats available");
            res.json({Message:"No seats available"});
        }
        await Promise.all(Booking.map(async(element) => {
            if(element.seatNo>seatDetails.length || seatDetails[element.seatNo-1].isBooked){
                res.json({Message:"Seat not Available"});
                throw new Error("Seat not available");
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
        res.send(tickets);
    }catch(err){
        res.json({Message:err});
        throw err;
    }
});


module.exports = router;