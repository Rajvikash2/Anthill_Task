const Booking = require('../models/BookingModel');
const Bus = require("../models/BusModel");


exports.bookBus = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { busId } = req.params;
        const { seatsBooked } = req.body;

        if (!seatsBooked) {
            return res.status(400).json({ error: "SeatsBooked is required" });
        }

        const bus = await Bus.findById(busId);
        if (!bus) return res.status(404).json({ error: "Bus not found" });

        if (bus.availableSeats < seatsBooked) {
            return res.status(400).json({ error: "Not enough available seats" });
        }

        bus.availableSeats -= seatsBooked;
        await bus.save();

        const booking = new Booking({ userId, busId, seatsBooked });
        await booking.save();

        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        await Booking.findByIdAndUpdate(bookingId, { status: "cancelled" });
        res.json({ message: "Booking cancelled" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
