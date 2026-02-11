import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./Routes/userRoutes.js";
import ownerRouter from "./Routes/ownerRoutes.js";
import bookingRouter from "./Routes/bookingsRoutes.js";

const app = express();

//connect databse
await connectDB();

//Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("It's working!!");
});

app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
});