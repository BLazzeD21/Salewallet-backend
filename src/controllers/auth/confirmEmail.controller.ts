import type { Request, Response } from "express";

import { logger } from "@/config";

import models from "@/models";

import { confirmedHTML } from "@/html";

import { isValidUUID } from "@/utils";

export const confirmEmail = async (request: Request, response: Response) => {
  try {
    response.header("Access-Control-Allow-Origin", "*");

    const { userId } = request.params;

    const { token } = request.query as {
      token?: string;
    };

    if (!userId || !isValidUUID(userId)) {
      return response.status(400).json({
        code: "INVALID_USER_ID",
        message: "Invalid or missing userId (UUID expected)",
      });
    }

    if (!token) {
      return response.status(400).json({
        code: "INVALID_INPUT",
        message: "Token is required",
      });
    }

    if (token.trim().length === 0) {
      return response.status(400).json({
        code: "INVALID_TOKEN",
        message: "Token cannot be empty",
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

    const verification = await models.email_verification.findOne({
      where: {
        user_id: user.user_id,
        confirmed: false,
      },
    });

    if (!verification) {
      return response.status(404).json({
        code: "TOKEN_NOT_FOUND",
        message: "Verification token not found",
      });
    }

    if (verification.expires_at < new Date()) {
      return response.status(400).json({
        code: "TOKEN_EXPIRED",
        message: "Verification token expired",
      });
    }

    if (verification.token !== token) {
      return response.status(400).json({
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

    return response.status(200).format({
      "application/json": () => {
        response.json({
          message: "Email successfully confirmed",
        });
      },
      "text/html": () => {
        response.send(confirmedHTML);
      },
      default: () => {
        response.status(406).send("Not Acceptable");
      },
    });
  } catch (error) {
    logger.error(error);
    return response.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred",
    });
  }
};
