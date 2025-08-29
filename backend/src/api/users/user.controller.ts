import { Request, Response } from "express";
import { User } from "../../models/User";

export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(req.user!.userId, req.body, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;

    try {
        // Fetch user with the password field
        const user = await User.findById(req.user!.userId).select('+password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if old password is correct
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect old password" });
        }

        // Set the new password and save (the 'pre-save' hook will hash it)
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });

    } catch (err) {
        console.error("CHANGE PASSWORD ERROR:", err);
        res.status(500).json({ message: "Server Error" });
    }
};
