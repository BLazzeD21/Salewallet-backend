import { Router } from "express";
import { confirmEmail } from "../controllers/confirmEmailController.js";
import { login } from "../controllers/loginController.js";

const router = Router();

router.get("/confirm-email", confirmEmail);
router.get("/login", login);

export default router;
