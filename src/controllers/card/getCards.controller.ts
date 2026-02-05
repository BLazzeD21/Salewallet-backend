import type { Request, Response } from "express";

import { logger } from "@/config";

import models from "@/models";

import { isValidUUID } from "@/utils";

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

    return response.status(200).json({
      user_id: userId,
      cards,
    });
  } catch (error) {
    logger.error(error);
    return response.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred",
    });
  }
};
