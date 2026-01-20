import { Router } from "express";
import { confirmEmail } from "../controllers/confirmEmail.js";

const router = Router();

router.get("/email/confirm", confirmEmail);

export default router;
