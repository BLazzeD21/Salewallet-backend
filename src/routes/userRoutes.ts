import { Router } from "express";
import { registerUser } from "../controllers/registrationController.js";

const router = Router();

router.post("/register", registerUser);

export default router;
