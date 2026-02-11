import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const carSchema = new mongoose.Schema({
    owner: {
        type: ObjectId, 
        ref: 'User'
    },

    brand: {
        type: String, 
        required: true
    },

    model: {
        type: String, 
        required: true
    },

    image: {
        type: String, 
        required: true
    },

    year: {
        type: Number,
        max: new Date().getFullYear(), 
        required: true
    },

    category: {
        type: String, 
        required: true
    },

    seating_capacity: {
        type: Number, 
        required: true
    },

    fuel_type: {
        type: String, 
        enum: ["gas","petrol", "diesel", "electric", "hybrid"],
        required: true
    },

    transmission: {
        type: String, 
        enum: ["manual", "automatic", "semi-automatic"],
        required: true
    },

    pricePerDay: {
        type: Number, 
        min: 0,
        required: true
    },

    location: {
        type: String, 
        required: true
    }, 

    description: {
        type: String, 
        required: true
    },

    isAvailable: {
        type: Boolean, 
        default: true,
    }
}, {timestamps: true});

const Car = mongoose.model('Car', carSchema);

export default Car;
