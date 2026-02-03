import type { Request, Response } from "express";
import { ValidationError } from "sequelize";

import { logger } from "@/config";

import models from "@/models";

import { isValidUUID } from "@/utils";

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

export const updateUserCard = async (request: Request, response: Response) => {
  try {
    const { cardId } = request.params;
    const { userId } = request.user;
    const { name, description, color, card_number, barcode, barcode_type, qr_data } = request.body;

    if (!isValidUUID(cardId)) {
      return response.status(400).json({
        code: "INVALID_CARD_ID",
        message: "Invalid cardId (UUID expected)",
      });
    }

    if (!isValidUUID(userId)) {
      return response.status(400).json({
        code: "INVALID_USER_ID",
        message: "Invalid userId (UUID expected)",
      });
    }

    const hasUpdatableFields =
      name !== undefined ||
      description !== undefined ||
      color !== undefined ||
      card_number !== undefined ||
      barcode !== undefined ||
      barcode_type !== undefined ||
      qr_data !== undefined;

    if (!hasUpdatableFields) {
      return response.status(400).json({
        code: "NO_UPDATE_FIELDS",
        message: "At least one field must be provided for update",
      });
    }

    const barcodeFields = [barcode, barcode_type, qr_data];
    const providedCount = barcodeFields.filter((v) => v !== undefined).length;

    if (providedCount !== 0 && providedCount !== 3) {
      return response.status(400).json({
        code: "INVALID_BARCODE_UPDATE",
        message: "barcode, barcode_type and qr_data must be provided together",
      });
    }

    const card = await models.card.findOne({
      where: {
        card_id: cardId,
        user_id: userId,
      },
    });

    if (!card) {
      return response.status(404).json({
        code: "CARD_NOT_FOUND",
        message: "Card not found or does not belong to user",
      });
    }

    const updateData: Record<string, unknown> = {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(color !== undefined && { color }),
      ...(card_number !== undefined && { card_number }),
    };

    if (providedCount === 3) {
      Object.assign(updateData, {
        barcode,
        barcode_type,
        qr_data,
      });
    }

    await card.update(updateData);

    return response.status(200).json({
      message: "Card updated successfully",
      data: card,
    });
  } catch (error) {
    logger.error(error);
    if (error instanceof ValidationError) {
      return response.status(400).json({
        code: "VALIDATION_ERROR",
        message: error.errors[0].message,
      });
    }

    return response.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred",
    });
  }
};
