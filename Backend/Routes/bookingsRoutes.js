import express from "express";
import { changeBookingStatus, checkAvailabilityOfCar, createBooking, getOwnerBookings, getUserBookings } from "../controllers/bookingController.js";
import { protect } from "../Middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkAvailabilityOfCar);
bookingRouter.post("/create-booking", protect, createBooking);
bookingRouter.get("/user-bookings", protect, getUserBookings);
bookingRouter.get("/owner-bookings", protect, getOwnerBookings);
bookingRouter.post("/change-status", protect, changeBookingStatus);

export default bookingRouter;