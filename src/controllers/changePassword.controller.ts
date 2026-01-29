import bcrypt from "bcrypt";
import type { Request, Response } from "express";

import models from "@/models";

import { isValidUUID } from "@/utils";

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;

    if (!userId || !isValidUUID(userId)) {
      return res.status(400).json({
        code: "INVALID_USER_ID",
        message: "Invalid or missing userId (UUID expected)",
      });
    }

    const { oldPassword, newPassword } = req.body as {
      userId?: string;
      oldPassword?: string;
      newPassword?: string;
    };

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        code: "INVALID_INPUT",
        message: "oldPassword and newPassword are required",
      });
    }

    const user = await models.user.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        code: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordValid) {
      return res.status(401).json({
        code: "INVALID_OLD_PASSWORD",
        message: "Old password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      code: "PASSWORD_CHANGED",
      message: "Password changed successfully",
    });
  } catch {
    return res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred",
    });
  }
};
