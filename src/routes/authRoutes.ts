import { Router } from "express";
import { confirmEmail } from "../controllers/confirmEmailController.js";
import { login } from "../controllers/loginController.js";
import { registerUser } from "../controllers/registrationController.js";

const router = Router();

router.post("/register", registerUser);
router.get("/confirm-email", confirmEmail);
router.get("/login", login);

export default router;
