import { Router } from "express";

import { confirmEmail, login, registerUser } from "@/controllers";

const router = Router();

router.post("/register", registerUser);
router.get("/confirm-email", confirmEmail);
router.get("/login", login);

export { router as authRoutes };
