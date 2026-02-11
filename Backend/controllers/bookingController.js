import Booking from "../models/Booking.js"
import Car from "../models/Car.js";

//fn. to check availability for a car for a given date or not
const checkAvailability = async (car, pickupDate, returnDate) => {
    if(new Date(returnDate) <= new Date(pickupDate)){
        return false;
    }

    const bookings = await Booking.find({ 
        car, 
        status: { $ne: "cancelled" },
        pickupDate: {$lte: returnDate}, 
        returnDate: {$gte: pickupDate} 
    });

    if(bookings.length > 0){
        return false;
    }

    return true;
}


//API to check car availability for given date and location
export const checkAvailabilityOfCar = async (req, res) => {
    try{
        const { location, pickupDate, returnDate } = req.body;

        if(new Date(returnDate) <= new Date(pickupDate)){
            return res.status(400).json({
                success:false,
                message:"Invalid date selection"
            });
        }

        //find booked cars
        const bookedCars = await Booking.find({
            status: { $ne: "cancelled" }, 
            pickupDate: { $lte: returnDate }, 
            returnDate: { $gte: pickupDate }
        }).distinct("car");

        //fetch available cars
        const availableCars = await Car.find({
            location: { $regex: new RegExp(`^${location}$`, "i") }, 
            isAvailable: true, 
            _id: { $nin: bookedCars }
        });

        return res.status(200).json({
            success: true, 
            cars: availableCars
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


//API to create booking
export const createBooking = async (req, res) => {
    try{
        const { _id } = req.user;

        const { car, pickupDate, returnDate } = req.body;

        const isAvailable = await checkAvailability(car, pickupDate, returnDate); 

        if(!isAvailable){
            return res.status(400).json({
                success: false, 
                message: "Car is not available"
            });
        }

        const carData = await Car.findById(car);

        //calculate price based on pickup date and return date
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);

        if(returned <= picked){
            return res.status(400).json({
                success:false,
                message:"Invalid booking dates"
            });
        }

        const numberOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));

        const price = carData.pricePerDay * numberOfDays;

        await Booking.create({ 
            car, 
            owner: carData.owner, 
            user: _id,
            pickupDate, 
            returnDate, 
            price
        });

        return res.status(200).json({
            success: true, 
            message: "Booking Created"
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


//API to list user bookings
export const getUserBookings = async (req, res) => {
    try{
        const { _id } = req.user;
        const bookings = await Booking.find({ user: _id })
        .populate("car")
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true, 
            bookings
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


//API to get owner bookings
export const getOwnerBookings = async (req, res) => {
    try{
        if(req.user.role !== "owner"){
            return res.status(403).json({
                success: false, 
                message: "Unauthorized"
            });
        }

        const bookings = await Booking.find({ owner: req.user._id })
        .populate("car user")
        .select("-user.password")
        .sort({createdAt: -1});

        return res.status(200).json({
            success: true, 
            bookings
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


//API to change booking status
export const changeBookingStatus = async (req, res) => {
    try{
        if(req.user.role !== "owner"){
            return res.status(403).json({
                success:false,
                message:"Unauthorized"
            });
        }

        const ownerId = req.user._id;
        const { bookingId, status } = req.body;

        const booking = await Booking.findById(bookingId);

        if(!booking){
            return res.status(404).json({
                success:false,
                message:"Booking not found"
            });
        }

        if(booking.owner.toString() !== ownerId.toString()){
            return res.status(403).json({
                success: false, 
                message: "Only owners can change booking status"
            });
        }

        booking.status = status;

        await booking.save();

        return res.status(200).json({
            success: true, 
            message: "Status updated"
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