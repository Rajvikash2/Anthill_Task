const Bus = require('../models/BusModel');

const addBus = async (req,res)=>{
    try{
        const bus = new Bus(req.body);
        await bus.save();
        res.status(201).json({message:"Bus added successfully"});
    }
    catch(err){
        res.status(400).json({message:err.message});
    }
}

const getBus = async (req,res)=>{
    try{
        const buses = await bus.find();
        res.status(200).json(buses);
    }
    catch(err){
        res.status(400).json({message:err.message});
    }
}

const updateBus = async(req,res)=>{
    try{
        const {id}=req.params;
        const { name, source, destination, seats, availableSeats, departureTime, price } = req.body;
        if (!name || !source || !destination || !seats || !availableSeats || !departureTime || !price) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const updatedBus = await Bus.findByIdAndUpdate(id,{ name, source, destination, seats, availableSeats, departureTime, price }, 
            { new: true, runValidators: true });
            if (!updatedBus) {
                return res.status(404).json({ error: "Bus not found" });
            }
    
            res.status(200).json(updatedBus);
    }
    catch(err){
        res.status(400).json({message:err.message});
    }
}

module.exports = {addBus,getBus,updateBus}