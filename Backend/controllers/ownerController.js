import User from "../models/user.js";
import imagekit from "../configs/imagekit.js";
import fs from "fs";
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";

//Fn. to change user role
export const changeRoleToOwner = async (req, res) => {
    try{
        const userId = req.user._id;

        if(req.user.role === "owner"){
            return res.status(400).json({
                success:false,
                message:"User is already an owner"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { role:"owner" },
            { new:true }
        ).select("-password");

        return res.status(200).json({
            success: true, 
            message: "Now you can list cars"
        });
    }

    catch(error){
        console.error(error.message);

        res.status(500).json({
            success: false,
            message: error.message 
        });
    }
}


//API to list cars
export const addCar = async (req, res) => {
    try{
        const ownerId = req.user._id;

        let car;

        try{
            car = JSON.parse(req.body.carData);
        }
        
        catch{
            return res.status(400).json({
                success:false,
                message:"Invalid car data"
            });
        }

        car.fuel_type = car.fuel_type?.toLowerCase();
        car.transmission = car.transmission?.toLowerCase();
        car.category = car.category?.toLowerCase();

        const imageFile = req.file;

        if(!imageFile){
            return res.status(400).json({
                success:false,
                message:"Car image is required"
            });
        }

        //read file
        const fileBuffer = await fs.promises.readFile(imageFile.path);

        //upload image to imagekit
        const response = await imagekit.upload({
            file: fileBuffer, 
            fileName: imageFile.originalname, 
            folder: "/cars"
        });

        await fs.promises.unlink(imageFile.path);

        //image optimization through imagekit
        var optimizedImageURL = imagekit.url({
            path: response.filePath,
            transformation: [
                { width: '1280' },
                { quality: 'auto'},
                { format: 'webp'}
            ]
        });

        const image = optimizedImageURL;
        await Car.create({
            ...car, 
            owner: ownerId, 
            image: optimizedImageURL
        });

        res.status(201).json({
            success: true, 
            message: "Car added successfully"
        });
    }

    catch(error){
        console.error(error.message);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}


//API to fetch owner cars
export const getOwnerCars = async(req, res) => {
    try{
        const ownerId = req.user._id;
        const cars = await Car.find({ owner: ownerId });

        return res.status(200).json({
            success: true, 
            cars
        });
    }

    catch(error){
        console.error(error.message);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}


//API to toggle car availability
export const toggleCarAvailability = async (req, res) => {
    try{
        const ownerId = req.user._id;
        const { carId } = req.body;

        const car = await Car.findById(carId);

        if(!car){
            return res.status(404).json({
                success:false,
                message:"Car not found"
            });
        }

        if(car.owner.toString() !== ownerId.toString()){
            return res.status(403).json({
                success: false, 
                message: "Unauthorized"
            });
        }

        car.isAvailable = !car.isAvailable;

        await car.save();

        return res.status(200).json({
            success: true, 
            message: "Availability toggled"
        });
    }

    catch(error){
        console.error(error.message);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}


//API to delete a car
export const deleteCar = async (req, res) => {
    try{
        const ownerId = req.user._id;
        const { carId } = req.body;

        const car = await Car.findById(carId);

        if(!car){
            return res.status(404).json({
                success:false,
                message:"Car not found"
            });
        }

        if(car.owner.toString() !== ownerId.toString()){
            return res.status(403).json({
                success: false, 
                message: "Unauthorized"
            });
        }

        car.owner = null;
        car.isAvailable = false;

        await car.save();

        return res.status(200).json({
            success: true, 
            message: "Car removed"
        });
    }

    catch(error){
        console.error(error.message);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}


//API to get dashboard data
export const getDashboardData = async (req, res) => {
    try{
        const { _id, role } = req.user;

        if(role !== "owner"){
            return res.status(403).json({
                success: false, 
                message: "Unauthorized"
            });
        }

        const cars = await Car.find({ owner: _id });
        const bookings = await Booking.find({owner: _id})
        .populate("car")
        .sort({ createdAt: -1 });

        const pendingBookings = await Booking.find({ 
            owner: _id, 
            status: "pending" 
        });

        const completedBookings = await Booking.find({ 
            owner: _id, 
            status: "confirmed" 
        });

        //calculate monthly revenue
        let monthlyRevenue = 0;

        for(const booking of bookings){
            if(booking.status === "confirmed"){
                monthlyRevenue += booking.price;
            }
        }

        //dashboard data
        const dashboardData = {
            totalCars: cars.length, 
            totalBookings: bookings.length, 
            pendingBookings: pendingBookings.length, 
            completedBookings: completedBookings.length, 
            recentBookings: bookings.slice(0, 3),
            monthlyRevenue 
        }

        return res.status(200).json({
            success: true, 
            dashboardData
        });
    }

    catch(error){
        console.error(error.message);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}


//API to update profile image
export const updateProfileImage = async (req, res) => {
    try{
        const { _id } = req.user;

        const imageFile = req.file;

        if(!req.file){
            return res.status(400).json({
                success:false,
                message:"No image uploaded"
            });
        }

        const fileBuffer = await fs.promises.readFile(req.file.path);

        const response = await imagekit.upload({
            file: fileBuffer, 
            fileName: imageFile.originalname, 
            folder: "/users"
        });

        var optimizedImageURL = imagekit.url({
            path: response.filePath,
            transformation: [
                { width: '400' },
                { quality: 'auto'},
                { format: 'webp'}
            ]
        });

        const image = optimizedImageURL;

        await User.findByIdAndUpdate(
            _id, 
            { image }
        );

        await fs.promises.unlink(req.file.path);
        
        return res.status(200).json({
            success: true, 
            message: "Image updated successfully"
        });
    }

    catch(error){
        console.error(error.message);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}