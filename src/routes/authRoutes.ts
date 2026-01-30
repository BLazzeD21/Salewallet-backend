import { Router } from "express";

import { changePassword, confirmEmail, deleteUser, login, refreshToken, registerUser } from "@/controllers";

import { verifyAuth } from "@/middlewares";

const router = Router();

router.post("/user/register", registerUser);
router.post("/user/login", login);
router.post("/user/refresh", refreshToken);
router.get("/user/:userId/confirm-email", confirmEmail);

router.delete("/user/:userId", verifyAuth, deleteUser);
router.patch("/user/:userId/change-password", verifyAuth, changePassword);

export { router as authRoutes };
