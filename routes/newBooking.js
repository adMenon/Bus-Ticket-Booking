const express = require('express');
const uniqid = require('uniqid');
const router = express.Router();

const Bus = require("../models/bus");
const User = require("../models/user");



// router.get('/showOpen', async(req, res)=>{
//     console.log(req.query);
//     try{
//         const seatDetails = await Bus.find({BusID:req.query.BusID, isBooked:false});
//         res.send({"Open Seats":seatDetails});
//     }
//     catch(err){
//         res.json({"error":"error"});
        
//     }
// });
// router.get('/showClosed', async(req, res)=>{
//     console.log(req.query);
//     try{

//         const seatDetails = await Bus.find({BusID:req.query.BusID, isBooked:true});
//         res.send({"Closed Seats":seatDetails});
//     }
//     catch(err){
//         res.json({"error":"error"});
        
//     }
// })


// router.post('/book',async(req,res)=>{

//     console.log(req.body);
//     try{
//         var tickets = [];
//         var Booking = req.body.booking;
//         var BId = uniqid();
//         const seatDetails = await Bus.find({BusID:req.body.BusId}).select({isBooked:1, _id:0})
//         // console.log(seatDetails);
//         await Promise.all(Booking.map(async(element) => {
            
//             if(element.seatNo>seatDetails.length || seatDetails[element.seatNo-1].isBooked){
//                 throw new Error("Seat not available");
//             }
//             const passenger = new Passenger(element.Passenger);
//             // console.log(insertPassenger);
//             const updateBus = await Bus.findOneAndUpdate({BusID : req.body.BusId, seatNo : element.seatNo},
//                 {"$set":{isBooked:true, PassengerDetails:passenger._id, BookingID:BId, PhoneNumber: req.body.PhoneNumber, DateOfBooking: Date.now }},
//                 {new:true}).populate('PassengerDetails');
//             tickets.push(updateBus); 
//         }));
//         res.send(tickets);
//     }catch(err){
//         res.send("error");
//         throw err;
//     }
// });


module.exports = router;