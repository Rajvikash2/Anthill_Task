const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    busId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Bus",
        required:true
    },
    seatsBooked:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:['booked','cancelled'],
        default:'booked'
    }
});

module.exports=mongoose.model('Booking',BookingSchema);
