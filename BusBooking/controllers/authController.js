const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const register = async(req,res)=>{
   try{
    const {name,email,password,role} = req.body;
    const hashedpwd= await bcrypt.hash(password,10);
    const newUser = new User({
        name,
        email,
        password:hashedpwd,
        role
    })
    await newUser.save();
    res.status(201).json({message:"User registered successfully"});
   }
   catch(err){
         res.status(400).json({message:err.message});
   }
    
}

const login = async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid password"});
        }
        const token = jwt.sign({userId:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:'1h'});
        res.status(200).json({token,role:user.role});
    }
    catch(err){
        res.status(400).json({message:err.message});
    }
}

module.exports = {register,login}