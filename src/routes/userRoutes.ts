import { Router } from "express";
import { createCard } from "../controllers/createCardController.js";
import { deleteCard } from "../controllers/deleteCardController.js";
import { getUserCards } from "../controllers/getCardsController.js";

const router = Router();

router.post("/users/:userId/create-card", createCard);
router.delete("/users/:userId/delete-card/:cardId", deleteCard);
router.get("/users/:userId/cards", getUserCards);

export default router;
