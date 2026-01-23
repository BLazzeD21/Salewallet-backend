import type { Request, Response } from "express";

import models from "@/models";

import { isValidUUID } from "@/utils";

export const getUserCards = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId || !isValidUUID(userId)) {
      return res.status(400).json({
        code: "INVALID_USER_ID",
        message: "Invalid or missing userId (UUID expected)",
      });
    }

    const user = await models.user.findByPk(userId);

    if (!user) {
      return res.status(404).json({
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

    return res.status(200).json({
      user_id: userId,
      cards,
    });
  } catch {
    return res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred",
    });
  }
};
