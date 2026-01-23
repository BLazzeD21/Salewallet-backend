import type { Request, Response } from "express";

import models from "@/models";

import { confirmedHTML } from "@/html";

import { isValidUUID } from "@/utils";

export const confirmEmail = async (req: Request, res: Response) => {
  try {
    res.header("Access-Control-Allow-Origin", "*");

    const { userId, token } = req.query as {
      userId?: string;
      token?: string;
    };

    if (!userId || !token) {
      return res.status(400).json({
        code: "INVALID_INPUT",
        message: "userId and token are required",
      });
    }

    if (!isValidUUID(userId)) {
      return res.status(400).json({
        code: "INVALID_UUID_FORMAT",
        message: "Invalid user ID format. Expected UUID format",
      });
    }

    if (token.trim().length === 0) {
      return res.status(400).json({
        code: "INVALID_TOKEN",
        message: "Token cannot be empty",
      });
    }

    const user = await models.user.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      return res.status(404).json({
        code: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    const verification = await models.email_verification.findOne({
      where: {
        user_id: user.user_id,
        confirmed: false,
      },
    });

    if (!verification) {
      return res.status(404).json({
        code: "TOKEN_NOT_FOUND",
        message: "Verification token not found",
      });
    }

    if (verification.expires_at < new Date()) {
      return res.status(400).json({
        code: "TOKEN_EXPIRED",
        message: "Verification token expired",
      });
    }

    if (verification.token !== token) {
      return res.status(400).json({
        code: "INVALID_TOKEN",
        message: "Invalid verification token",
      });
    }

    user.confirmed = true;
    await user.save();

    await models.email_verification.destroy({
      where: {
        user_id: user.user_id,
      },
    });

    return res.status(200).format({
      "application/json": () => {
        res.json({
          message: "Email successfully confirmed",
        });
      },
      "text/html": () => {
        res.send(confirmedHTML);
      },
      default: () => {
        res.status(406).send("Not Acceptable");
      },
    });
  } catch {
    return res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred",
    });
  }
};
