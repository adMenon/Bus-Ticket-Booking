const express = require('express');

const router = express.Router();

const Bus = require("../models/bus");






var busId = 90000;

router.post('/addBus', async(req, res)=>{
    var noOfSeats = req.body.noOfSeats;
    var busSeats = [];
    for(var i = 1;i<=noOfSeats;i++){
        busSeats.push(new Bus({
            BusID:busId,
            seatNo: i
        }));
    }
    try{
        const newBus = await Bus.insertMany(busSeats);
        console.log(newBus)
        res.send(newBus);
        busId++;
    }catch(err){
        res.send("errr");
        throw err;
    }
});
router.get('/getBuses/:BusID', async(req,res)=>{
    try{
        const Buses = await Bus.find({BusID:req.params.BusID}).populate('PassengerDetails');
        console.log(Buses);
        res.json(Buses);
    }
    catch(err){
        res.send(err);
        throw err;
    }
});



router.patch('/reset/:BusID', async(req,res)=>{
    try{
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
    try{
        const removedBus = await Bus.remove({});
        console.log(removedBus.deletedCount + " Bus(es) removed")
        res.json(removedBus);
    }
    catch(err){
        res.send({"error":err});
    }
});


router.delete('/deleteBus', async(req,res)=>{
    try{
        const removedBus = await Bus.remove({_id:req.body.busId});
        res.json(removedBus);
    }
    catch{
        res.send({"error":err});
    }
});


module.exports = router;