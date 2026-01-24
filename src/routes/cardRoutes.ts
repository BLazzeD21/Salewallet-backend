import { Router } from "express";

import { createCard, deleteCard, getUserCards, updateUserCard } from "@/controllers";

const router = Router();

router.post("/card", createCard);
router.delete("/card/:cardId", deleteCard);
router.patch("/card/:cardId", updateUserCard);
router.get("/card", getUserCards);

export { router as cardRoutes };
