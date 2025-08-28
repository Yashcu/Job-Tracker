import { Request, Response } from "express";
import { User } from "../../models/User";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";

export const getMe = async (req: Request, res:Response) => {
    try{
        const user = await User.findById(req.user!.userId).select('-password');
        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.json(user);
    }
    catch(err){
        res.status(500).json({
            message: "Server Error"
        });
    }
}

export const register = async (req: Request, res: Response) => {
    try{
        const {name, email, password} = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message: "User already Exists"
            });
        }

        await User.create({ name, email, password });

        res.status(201).json({
            message: "User registered Successfully"
        });
    }
    catch(err){
        res.status(500).json({
            message: "User Not Registered",
            error: "Server error during registration"
        });
    }
}

export const login = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email}).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7*24*60*60*1000,
        });

        res.json({accessToken});
    }
    catch(err){
        res.status(500).json({
            error: "Server Error"
        });
    }
};

export const logout = async (_req: Request, res: Response) => {
    res.clearCookie('refreshToken');
    res.status(200).json({
        message: 'Logged out successfully'
    });
}

