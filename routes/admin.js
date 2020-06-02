const express = require('express');
const uniqid = require('uniqid');

const router = express.Router();

const Bus = require("../models/bus");


router.post('/addBus', async(req, res)=>{
    
    if(req.UserData.isAdmin==false){
        console.log("Access Denied");
        res.json("Access Denied");
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
        res.json(newBus);
        busId++;
    }catch(err){
        res.json({Message:err});
        throw err;
    }
});
router.get('/getBus/:BusID', async(req,res)=>{
    if(req.UserData.isAdmin==false){
        console.log("Access Denied");
        res.json("Access Denied");
    }
    try{
        if(req.params.BusID==undefined)
        {
            console.log("BusId invalid");
            res.json({Message:"BusID invalid"});
        }
        const Buses = await Bus.find({BusID:req.params.BusID});
        console.log(Buses);
        res.json(Buses);
    }
    catch(err){
        res.send(err);
        throw err;
    }
});

router.get('/allBus', async(req,res)=>{
    if(req.UserData.isAdmin==false){
        console.log("Access Denied");
        res.json("Access Denied");
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
        res.json(Buses);
    }
    catch(err){
        res.json(err);
        throw err;
    }
});


router.put('/:BusID', async(req,res)=>{
    if(req.UserData.isAdmin==false){
        console.log("Access Denied");
        res.json("Access Denied");
    }
    try{
        if(req.params.BusID==undefined)
        {
            console.log("BusId invalid");
            res.json({Message:"BusID invalid"});
        }
        const updateBus = await Bus.updateMany({BusID:req.params.BusID},
            {"$set":{isBooked:false}, "$unset":{PassengerDetails:1, BookingID:1, PhoneNumber:1, DateOfBooking:1}});
        console.log(updateBus+" \nTickets deleted, seats flushed");
        res.json("Seats flushed");
    }
    catch(err){
        res.send("err");
        throw err;
    }
});

router.delete('/deleteAll', async(req,res)=>{
    
    if(req.UserData.isAdmin==false){
        console.log("Access Denied");
        res.json("Access Denied");
    }
    try{
        const removedBus = await Bus.remove({});
        console.log(removedBus.deletedCount + " Bus(es) removed")
        res.json(removedBus);
    }
    catch(err){
        res.send({"error":err});
    }
});


router.delete('/:BusID', async(req,res)=>{
    if(req.UserData.isAdmin==false){
        console.log("Access Denied");
        res.json("Access Denied");
    }
    try{
        if(req.params.BusID==undefined)
        {
            console.log("BusId invalid");
            res.json({Message:"BusID invalid"});
        }
        const removedBus = await Bus.deleteMany({BusID:req.params.BusID});
        console.log(removedBus)
        res.json(removedBus);
    }
    catch(err){

        res.send({"error":err});
        throw err;
    }
});


module.exports = router;