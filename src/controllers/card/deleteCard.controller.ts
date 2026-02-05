import type { Request, Response } from "express";

import { logger } from "@/config";

import models from "@/models";

import { isValidUUID } from "@/utils";

export const deleteCard = async (request: Request, response: Response) => {
  try {
    const { userId } = request.user;
    const { cardId } = request.params;

    if (!userId || !cardId) {
      return response.status(400).json({
        code: "INVALID_INPUT",
        message: "userId and cardId are required",
      });
    }

    if (!isValidUUID(userId) || !isValidUUID(cardId)) {
      return response.status(400).json({
        code: "INVALID_UUID_FORMAT",
        message: "Invalid UUID format for userId or cardId",
      });
    }

    const user = await models.user.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      return response.status(404).json({
        code: "USER_NOT_FOUND",
        message: "User not found",
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
        message: "Card not found for this user",
      });
    }

    await card.destroy();

    return response.status(200).json({
      message: "Card successfully deleted",
    });
  } catch (error) {
    logger.error(error);
    return response.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred",
    });
  }
};
