import { Router } from "express";

import { createCard, deleteCard, getUserCards } from "@/controllers";

const router = Router();

router.post("/users/:userId/create-card", createCard);
router.delete("/users/:userId/delete-card/:cardId", deleteCard);
router.get("/users/:userId/cards", getUserCards);

export { router as userRoutes };
