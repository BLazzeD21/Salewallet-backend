import type { Request, Response } from "express";
import { Op, ValidationError } from "sequelize";

import { logger } from "@/config";

import models from "@/models";

import { isValidUUID } from "@/utils";

export const createCard = async (request: Request, response: Response) => {
  try {
    const { userId, card_number, name, description, color, barcode, barcode_type, qr_data } = request.body;

    if (!userId || !isValidUUID(userId)) {
      return response.status(400).json({
        code: "INVALID_USER_ID",
        message: "Invalid or missing userId (UUID expected)",
      });
    }

    if (!card_number || !name || !barcode || !barcode_type || !qr_data) {
      return response.status(400).json({
        code: "INVALID_INPUT",
        message: "card_number, name, barcode, barcode_type, and qr_data are required",
      });
    }

    const user = await models.user.findByPk(userId);
    if (!user) {
      return response.status(404).json({
        code: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    const existingCard = await models.card.findOne({
      where: {
        user_id: userId,
        [Op.or]: [{ card_number }, { barcode }, { qr_data }],
      },
    });

    if (existingCard) {
      let field = "";
      if (existingCard.card_number === card_number) field = "card_number";
      else if (existingCard.barcode === barcode) field = "barcode";
      else if (existingCard.qr_data === qr_data) field = "qr_data";

      return response.status(400).json({
        code: "DUPLICATE_ENTRY",
        message: `${field} already exists`,
      });
    }

    const card = await models.card.create({
      user_id: userId,
      card_number,
      name,
      description,
      color,
      barcode,
      barcode_type,
      qr_data,
    });
    return response.status(201).json({ card });
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
