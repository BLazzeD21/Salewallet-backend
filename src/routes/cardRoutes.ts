import { Router } from "express";

import { createCard, deleteCard, getUserCards, updateUserCard } from "@/controllers";

import { verifyAuth } from "@/middlewares";

const router = Router();

router.post("/card", verifyAuth, createCard);
router.delete("/card/:cardId", verifyAuth, deleteCard);
router.patch("/card/:cardId", verifyAuth, updateUserCard);
router.get("/card", verifyAuth, getUserCards);

export { router as cardRoutes };
