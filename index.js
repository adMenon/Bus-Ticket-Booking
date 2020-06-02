// const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/hcTest1", { useNewUrlParser: true, useUnifiedTopology: true  },  (error)=>{
//     if (error)
//         throw error;
//     console.log("database connection successfull");
// });

const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const app = express();
require('dotenv/config');


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const newBookingRoute = require('./routes/newBooking');
const adminRoute = require('./routes/admin');
const ticketStatusRoute = require('./routes/ticketStatus');
const userAuthRoutes = require('./routes/userAuth');

const checkAuth = require("./middleware/checkAuth");

app.use(morgan('dev'));

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','*');
    if(req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, POST, GET, PUT, PATCH, DELETE');
        res.status(200).json({});
    }
    next();
})

app.use('/userAuth', userAuthRoutes);
app.use('/newBooking', checkAuth, newBookingRoute);
app.use('/admin', checkAuth, adminRoute);
app.use('/ticketStatus',checkAuth, ticketStatusRoute);

app.get('/', (req,res)=>{
    res.status(200).json({Message:"Server works, listening to "+port});
});

app.use((req,res,next)=>{
    const error = new Error('Not found');
    error.status=404;
    next(error);
})
app.use((error,req,res,next) =>{
    res.status(error.status|| 500).json({
        error:{
            Message: error.message
        }
    });
});


//Routes


const port = process.env.PORT||3000 



app.listen(port,(err)=>{
    if (err)
        throw err;
    console.log("Listening to "+port);
    
});


mongoose.connect(process.env.DBCONN,
 { useNewUrlParser: true, useUnifiedTopology: true  },
   (error)=>{
    if (error)
        throw error;
    console.log("database connection successfull");
});