import { Router } from "express";

import { changePassword, confirmEmail, login, registerUser } from "@/controllers";

const router = Router();

router.post("/user/register", registerUser);
router.get("/user/:userId/confirm-email", confirmEmail);
router.get("/user/login", login);
router.post("/user/:userId/change-password", changePassword);

export { router as authRoutes };
