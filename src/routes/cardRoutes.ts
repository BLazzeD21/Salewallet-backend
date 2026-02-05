import { Router } from "express";

import { CardController } from "@/controllers";

import { verifyAuth } from "@/middlewares";

const controller = new CardController();

const router = Router();

/**
 * @openapi
 * /card:
 *   get:
 *     tags:
 *       - Card
 *     summary: Get all cards of authenticated user
 *     description: Retrieves all cards associated with the authenticated user. Returns 404 if user not found or no cards.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cards retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCardsResponse'
 *       400:
 *         description: Invalid userId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvalidUserIdError'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserNotFoundError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */

router.get("/card", verifyAuth, controller.getCards);

/**
 * @openapi
 * /card:
 *   post:
 *     tags:
 *       - Card
 *     summary: Create a new card for a user
 *     description: Creates a new card associated with the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCardRequest'
 *     responses:
 *       201:
 *         description: Card created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateCardResponse'
 *       400:
 *         description: Invalid input or duplicate
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/InvalidUserIdError'
 *                 - $ref: '#/components/schemas/InvalidInputCardError'
 *                 - $ref: '#/components/schemas/DuplicateEntryError'
 *                 - $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserNotFoundError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */

router.post("/card", verifyAuth, controller.create);

/**
 * @openapi
 * /card/{cardId}:
 *   delete:
 *     tags:
 *       - Card
 *     summary: Delete a user card
 *     description: Deletes a card belonging to the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CardIdParam'
 *     responses:
 *       200:
 *         description: Card successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteCardResponse'
 *       400:
 *         description: Invalid input or UUID format
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/InvalidInputDeleteError'
 *                 - $ref: '#/components/schemas/InvalidUUIDFormatError'
 *       404:
 *         description: User or card not found
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/UserNotFoundError'
 *                 - $ref: '#/components/schemas/CardNotFoundError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */

router.delete("/card/:cardId", verifyAuth, controller.delete);

/**
 * @openapi
 * /card/{cardId}:
 *   patch:
 *     tags:
 *       - Card
 *     summary: Update a user card
 *     description: Updates one or more fields of a card. barcode, barcode_type, and qr_data must be provided together if updating any of them.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CardIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCardRequest'
 *     responses:
 *       200:
 *         description: Card updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateCardResponse'
 *       400:
 *         description: Invalid input or request
 *         content:
 *           application/json:
 *             schema:
 *                oneOf:
 *                  - $ref: '#/components/schemas/InvalidCardIdError'
 *                  - $ref: '#/components/schemas/InvalidUserIdError'
 *                  - $ref: '#/components/schemas/NoUpdateFieldsError'
 *                  - $ref: '#/components/schemas/InvalidBarcodeUpdateError'
 *                  - $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CardNotFoundError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */

router.patch("/card/:cardId", verifyAuth, controller.update);

export { router as cardRoutes };
