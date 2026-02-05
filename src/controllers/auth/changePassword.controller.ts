import bcrypt from "bcrypt";
import type { Request, Response } from "express";

import { logger } from "@/config";

import models from "@/models";

import { isValidUUID } from "@/utils";

export const changePassword = async (request: Request, response: Response) => {
  try {
    const { userId } = request.user;

    if (!userId || !isValidUUID(userId)) {
      return response.status(400).json({
        code: "INVALID_USER_ID",
        message: "Invalid or missing userId (UUID expected)",
      });
    }

    const { oldPassword, newPassword } = request.body as {
      userId?: string;
      oldPassword?: string;
      newPassword?: string;
    };

    if (!oldPassword || !newPassword) {
      return response.status(400).json({
        code: "INVALID_INPUT",
        message: "oldPassword and newPassword are required",
      });
    }

    const user = await models.user.findByPk(userId);
    if (!user) {
      return response.status(404).json({
        code: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordValid) {
      return response.status(401).json({
        code: "INVALID_OLD_PASSWORD",
        message: "Old password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    return response.status(200).json({
      code: "PASSWORD_CHANGED",
      message: "Password changed successfully",
    });
  } catch (error) {
    logger.error(error);
    return response.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred",
    });
  }
};
