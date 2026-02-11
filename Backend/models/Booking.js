import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema({
    car: { 
        type: ObjectId, 
        ref: "Car", 
        required: true
    },

    user: { 
        type: ObjectId, 
        ref: "User", 
        required: true 
    },

    owner: { 
        type: ObjectId, 
        ref: "User", 
        required: true 
    },

    pickupDate: { 
        type: Date, 
        required: true 
    },

    returnDate: { 
        type: Date, 
        required: true,
        validate:{
            validator:function(val){
                return val > this.pickupDate;
            },
            message:"Return date must be after pickup date"
        }
    },

    status: { 
        type: String, 
        enum: ["pending", "confirmed", "cancelled"], 
        default: "pending"
    },

    paymentStatus:{
        type:String,
        enum:["pending","paid","failed"],
        default:"pending"
    },

    price: { 
        type: Number, 
        required: true,
        min:0
    }
}, {timestamps: true});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
