const express = require('express');
const uniqid = require('uniqid');

const router = express.Router();

const Bus = require("../models/bus");


router.post('/addBus', async(req, res)=>{
    
    if(req.UserData.isAdmin==false){
        console.log("Access Denied");
        return res.status(403).json({Message:"Access Denied"});
    }
    var noOfSeats = req.body.noOfSeats;
    var busSeats = [];
    var BusID = uniqid();
    for(var i = 1;i<=noOfSeats;i++){
        busSeats.push(new Bus({
            BusID:BusID,
            seatNo: i
        }));
    }
    try{
        const newBus = await Bus.insertMany(busSeats);
        console.log(newBus)
        res.status(201).json({Message:"Bus added with "+ newBus.length+" seats", BusID:newBus[0].BusID}); 
    }catch(err){
        res.status(500).json({Error:err});
        throw err;
    }
});
router.get('/Bus/:BusID', async(req,res)=>{
    if(req.UserData.isAdmin==false){
        console.log("Access Denied");
        return res.status(403).json({Message:"Access Denied"});
    }
    try{
        if(req.params.BusID==undefined)
        {
            console.log("BusId invalid");
            return res.status(400).json({Message:"BusID invalid"});
        }
        const Buses = await Bus.find({BusID:req.params.BusID});
        console.log(Buses);
        if(Buses.length==0)
        {
            console.log("Bus not found");
            return res.status(404).json({Message:"Bus not found"});
        }
        res.status(200).json(Buses);
    }
    catch(err){
        res.status(500).json({Error:err});
        throw err;
    }
});

router.get('/allBuses', async(req,res)=>{
    if(req.UserData.isAdmin==false){
        console.log("Access Denied");
        return res.status(403).json({Message:"Access Denied"});
    }
    try{
        // console.log("here");
        const Buses = await Bus.aggregate(
            [{
                "$group":{
                    _id:"$BusID",
                    count:{"$sum":1}
                    }
            }]);
        console.log(Buses);
        res.status(200).json(Buses);
    }
    catch(err){
        res.status(500).json({Error:err});
        throw err;
    }
});


router.patch('/Bus/:BusID', async(req,res)=>{
    if(req.UserData.isAdmin==false){
        console.log("Access Denied");
        return res.status(403).json({Message:"Access Denied"});
    }
    try{
        if(req.params.BusID==undefined)
        {
            console.log("BusId invalid");
            return res.status(400).json({Message:"BusID invalid"});
        }
        const updateBus = await Bus.updateMany({BusID:req.params.BusID},
            {"$set":{isBooked:false}, "$unset":{PassengerDetails:1, BookingID:1, PhoneNumber:1, DateOfBooking:1}});
        if(updateBus.n==0){
            console.log("Bus not found");
            return res.status(404).json({Message:"Bus not found"});
        }
        console.log("Tickets deleted, seats flushed", updateBus);
        res.status(200).json({Message:"Seats flushed"});
    }
    catch(err){
        res.status(500).json({Error:err});

        throw err;
    }
});

router.delete('/deleteAll', async(req,res)=>{
    
    if(req.UserData.isAdmin==false){
        console.log("Access Denied");
        res.status(403).json({Message:"Access Denied"});
    }
    try{
        const removedBus = await Bus.deleteMany();
        console.log(removedBus.deletedCount + " Bus(es) removed")
        res.status(200).json({Message: "All buses deleted"});
    }
    catch(err){
        res.status(500).json({Error:err});;
        throw err;
    }
});


router.delete('/Bus/:BusID', async(req,res)=>{
    if(req.UserData.isAdmin==false){
        console.log("Access Denied");
        res.status(403).json({Message:"Access Denied"});
    }
    try{
        if(req.params.BusID==undefined)
        {
            console.log("BusId invalid");
            return res.status(400).json({Message:"BusID invalid"});
        }
        const removedBus = await Bus.deleteMany({BusID:req.params.BusID});
        if(removedBus.n==0){
            console.log("Bus not found");
            return res.status(404).json({Message:"Bus not found"});
        }
        console.log(removedBus)
        res.status(200).json({Message: "Bus deleted"});
    }
    catch(err){
        res.status(500).json({Error:err});;
        throw err;
    }
});


module.exports = router;