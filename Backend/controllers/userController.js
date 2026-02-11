import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Car from "../models/Car.js";

//Generate JWT token
const generateToken = (userId) => { 
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET_KEY, 
        { expiresIn: "7d" }
    );
}


//Register User
export const registerUser = async (req, res) => {
    try{
        const { name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                success: false, 
                message: "Missing credentials"
            });
        }

        if(password.length < 6){
            return res.status(400).json({
                success:false,
                message:"Password must be at least 6 characters long"
            });
        }

        const userExists = await User.findOne({ email });

        if(userExists){
            return res.status(409).json({
                success: false, 
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ 
            name, 
            email, 
            password: hashedPassword 
        });

        const token = generateToken(user._id.toString());

        return res.status(201).json({
            success: true, 
            token, 
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }

    catch(error){
        console.log(error.message);

        return res.status(500).json({
            success: false, 
            message: "Server Error"
        });
    }
}


//User Login
export const loginUser = async (req, res) => {
    try{
        const { email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Missing credentials"
            });
        }

        const user = await User.findOne({ email });
        
        if(!user){
            return res.status(404).json({
                success: false, 
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            });
        }

        const token = generateToken(user._id.toString());

        return res.status(200).json({
            success: true, 
            token, 
            user: {
                id: user._id, 
                name: user.name, 
                email: user.email
            } 
        });
    }

    catch(error){
        console.log(error.message);

        return res.status(500).json({
            success: false, 
            message: "Server Error"
        });
    }
}


//Get user data using JWT token
export const getUserData = async (req, res) => {
    try{
        if(!req.user){
            return res.status(401).json({
                success:false,
                message:"Not authorized"
            });
        }

        return res.status(200).json({
            success: true, 
            user: req.user
        });
    }

    catch(error){
        console.log(error.message);

        return res.status(500).json({
            success: false, 
            message: "Server Error"
        });
    }
}


//Get all cars
export const getCars = async (req, res) => {
    try{
        const cars = await Car.find({ isAvailable: true });

        return res.status(200).json({
            success: true, 
            cars
        });
    }

    catch(error){
        console.log(error.message);

        return res.status(500).json({
            success: false, 
            message: "Server Error"
        });
    }
}