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




app.get('/', (res)=>{
    res.send({"booyah":"booyah"});
});


app.listen(3000,(err)=>{
    if (err)
        throw err;
    console.log("Listening to 3000");
});
