import type { Request, Response } from "express";

import models from "@/models";

import { isValidUUID } from "@/utils";

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
 *         description: User not found or no cards
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/UserNotFoundError'
 *                 - $ref: '#/components/schemas/CardsNotFoundError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */

export const getUserCards = async (request: Request, response: Response) => {
  try {
    const { userId } = request.user;

    if (!userId || !isValidUUID(userId)) {
      return response.status(400).json({
        code: "INVALID_USER_ID",
        message: "Invalid or missing userId (UUID expected)",
      });
    }

    const user = await models.user.findByPk(userId);

    if (!user) {
      return response.status(404).json({
        code: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    const cards = await models.card.findAll({
      where: {
        user_id: userId,
      },
      order: [["added_at", "DESC"]],
      attributes: [
        "card_id",
        "card_number",
        "name",
        "description",
        "color",
        "barcode",
        "barcode_type",
        "qr_data",
        "added_at",
      ],
    });

    if (!cards || cards.length === 0) {
      return response.status(404).json({
        code: "CARD_NOT_FOUND",
        message: "No cards found for this user",
      });
    }

    return response.status(200).json({
      user_id: userId,
      cards,
    });
  } catch {
    return response.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred",
    });
  }
};
