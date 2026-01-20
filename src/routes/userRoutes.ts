import { Router } from "express";
import { createCard } from "../controllers/createCardController.js";
import { deleteCard } from "../controllers/deleteCardController.js";
import { registerUser } from "../controllers/registrationController.js";

const router = Router();

router.post("/register", registerUser);
router.post("/users/:userId/create-card", createCard);
router.delete("/users/:userId/delete-card/:cardId", deleteCard);

export default router;
