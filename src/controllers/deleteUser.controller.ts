import bcrypt from "bcrypt";
import type { Request, Response } from "express";

import models from "@/models";

import { isValidUUID } from "@/utils";

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;
    const { password } = req.body as { password?: string };

    if (!userId || !password) {
      return res.status(400).json({
        code: "INVALID_INPUT",
        message: "userId and password are required",
      });
    }

    if (!isValidUUID(userId)) {
      return res.status(400).json({
        code: "INVALID_UUID_FORMAT",
        message: "Invalid UUID format for userId",
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

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        code: "INVALID_CREDENTIALS",
        message: "Invalid password",
      });
    }

    await user.destroy();

    return res.status(200).json({
      message: "User successfully deleted",
    });
  } catch {
    return res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred",
    });
  }
};
