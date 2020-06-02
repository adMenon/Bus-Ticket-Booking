// const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/hcTest1", { useNewUrlParser: true, useUnifiedTopology: true  },  (error)=>{
//     if (error)
//         throw error;
//     console.log("database connection successfull");
// });

const mongoose = require("mongoose");
const express = require("express");
const app = express();
require('dotenv/config');


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const newBookingRoute = require('./routes/newBooking');
const adminRoute = require('./routes/admin');
const ticketStatusRoute = require('./routes/ticketStatus');
const userAuthRoutes = require('./routes/userAuth');




//Middlewares

app.use('/userAuth', userAuthRoutes);
app.use('/newBooking', newBookingRoute);
app.use('/admin', adminRoute);
app.use('/ticketStatus', ticketStatusRoute);


//Routes


app.get('/', (res)=>{
    res.send({"booyah":"booyah"});
});


app.listen(3000,(err)=>{
    if (err)
        throw err;
    console.log("Listening to 3000");
});


mongoose.connect(process.env.DBCONN,
 { useNewUrlParser: true, useUnifiedTopology: true  },
   (error)=>{
    if (error)
        throw error;
    console.log("database connection successfull");
});