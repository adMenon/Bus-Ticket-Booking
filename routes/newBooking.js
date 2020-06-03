const express = require('express');
const uniqid = require('uniqid');
const router = express.Router();

const Bus = require("../models/bus");

router.get('/allBuses', async(req,res)=>{
    try{
        // console.log("here");
        const Buses = await Bus.aggregate(
            [{
                "$group":{
                    _id:"$BusID",
                    "Number of Seats":{"$sum":1}
                    }
            }]);
        console.log(Buses);
        if(Buses.length==0){
            return res.status(404).json({Message: "No buses found"});
        }
        res.status(200).json({Buses:Buses});
    }
    catch(err){
        res.status(500).json({Error:err});
        throw err;
    }
});


router.get('/showOpen', async(req, res)=>{
    console.log(req);
    if(req.query.BusID==undefined)
    {
        console.log("BusId invalid");
        return res.status(400).json({Message:"BusID invalid"});
    }
    try{
        const seatDetails = await Bus.find({BusID:req.query.BusID, isBooked:false}).select({seatNo:1, _id:0});
        res.status(200).json({"Number of open seats":seatDetails.length,"Open Seats":seatDetails});
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
        res.status(200).json({"Number of open seats":seatDetails.length,"Closed Seats":seatDetails});
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
        var Booking = req.body.Booking;
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
        var seatlist = []
        for(var i = 0;i<Booking.length;i++){
            
            if(Booking[i].seatNo>seatDetails.length || seatDetails[Booking[i].seatNo-1].isBooked){
                console.log("Seat no "+Booking[i].seatNo+" is/are not available");
                seatlist.push(Booking[i].seatNo);
            }
        }
        if(seatlist.length>0)
            return res.status(400).json({Message:"Seats "+seatlist+" is not available"});

        await Promise.all(Booking.map(async(element) => {
            
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
        res.status(200).json({"Number of tickets booked":tickets.length,tickets});
    }catch(err){
        res.status(500).json({Message:err});
        throw err;
    }
});


module.exports = router;