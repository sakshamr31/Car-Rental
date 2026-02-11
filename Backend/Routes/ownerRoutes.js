import express from "express";
import { protect } from "../Middleware/auth.js";
import { addCar, changeRoleToOwner, deleteCar, getDashboardData, getOwnerCars, toggleCarAvailability, updateProfileImage } from "../controllers/ownerController.js";
import upload from "../Middleware/multer.js";

const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect, changeRoleToOwner);
ownerRouter.post("/add-car", upload.single("image"), protect, addCar);
ownerRouter.get("/cars", protect, getOwnerCars);
ownerRouter.post("/toggle-car", protect, toggleCarAvailability);
ownerRouter.post("/delete-car", protect, deleteCar);
ownerRouter.get("/dashboard", protect, getDashboardData);
ownerRouter.post("/update-image", upload.single("image"), protect, updateProfileImage);

export default ownerRouter;