import { Router } from "express";

import { createCard, deleteCard, getUserCards } from "@/controllers";

const router = Router();

router.post("/card", createCard);
router.delete("/card/:cardId", deleteCard);
router.get("/card", getUserCards);

export { router as cardRoutes };
