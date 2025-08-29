import { Router } from "express";
import { updateUser, changePassword } from "./user.controller";
import { AuthMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation.middleware";
import { z } from "zod";

const router = Router();

const updateUserSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.email().optional(),
});

const changePasswordSchema = z.object({
    oldPassword: z.string().min(6),
    newPassword: z.string().min(6),
}).refine(data => data.newPassword !== data.oldPassword, {
    message: "New password must be different from the old password.",
    path: ["newPassword"],
});

router.put("/me", AuthMiddleware, validate(updateUserSchema), updateUser);
router.post("/change-password", AuthMiddleware, validate(changePasswordSchema), changePassword);

export default router;
