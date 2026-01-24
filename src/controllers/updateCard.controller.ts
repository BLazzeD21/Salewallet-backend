import type { Request, Response } from "express";
import { ValidationError } from "sequelize";

import models from "@/models";

import { isValidUUID } from "@/utils";

export const updateUserCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const { userId, name, description, color, card_number, barcode, barcode_type, qr_data } = req.body;

    if (!isValidUUID(cardId)) {
      return res.status(400).json({
        code: "INVALID_CARD_ID",
        message: "Invalid cardId (UUID expected)",
      });
    }

    if (!isValidUUID(userId)) {
      return res.status(400).json({
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
      return res.status(400).json({
        code: "NO_UPDATE_FIELDS",
        message: "At least one field must be provided for update",
      });
    }

    const barcodeFields = [barcode, barcode_type, qr_data];
    const providedCount = barcodeFields.filter((v) => v !== undefined).length;

    if (providedCount !== 0 && providedCount !== 3) {
      return res.status(400).json({
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
      return res.status(404).json({
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

    return res.status(200).json({
      message: "Card updated successfully",
      card,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        code: "VALIDATION_ERROR",
        message: error.errors[0].message,
      });
    }

    return res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred",
    });
  }
};
