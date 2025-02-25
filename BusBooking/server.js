require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app=express();
app.use(express.json());

app.use((req,res,next)=>{ 
next();
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/buses", require("./routes/busRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));

//Connect DB

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT} and db is connected`);
    })
})
.catch((err)=>{
    console.log("Failed to connect",err);
})
