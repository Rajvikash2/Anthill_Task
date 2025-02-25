const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BusSchema = new Schema({
    name: String,
    source: String,
    destination: String,
    seats: Number,
    availableSeats: Number,
    departureTime: String,
    price: Number,
});

module.exports = mongoose.model("Bus", BusSchema);
