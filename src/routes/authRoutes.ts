import { Router } from "express";

import { changePassword, confirmEmail, login, registerUser } from "@/controllers";

const router = Router();

router.post("/register", registerUser);
router.get("/confirm-email", confirmEmail);
router.get("/login", login);
router.post("/user/:userId/change-password", changePassword);

export { router as authRoutes };
