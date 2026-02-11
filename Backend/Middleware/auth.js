import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success:false,
                message:"Not authorized"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.user = await User
            .findById(decoded.id)
            .select("-password");

        if(!req.user){
            return res.status(401).json({
                success: false, 
                message: "Not authorized"
            });
        }

        next();
    }

    catch(error){
        console.log(error.message);

        return res.status(401).json({
            success: false, 
            message: "Not authorized"
        });
    }
}