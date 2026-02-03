import bcrypt from "bcrypt";
import type { Request, Response } from "express";

import { logger } from "@/config";

import models from "@/models";

import { isValidUUID } from "@/utils";

/**
 * @openapi
 * /user/{userId}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete authenticated user
 *     security:
 *       - BearerAuth: []
 *     description: Deletes the authenticated user. Requires password confirmation.
 *     parameters:
 *       - $ref: '#/components/parameters/UserIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: "StrongPassword123"
 *     responses:
 *       200:
 *         description: User successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteUserResponse'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/InvalidInputDeleteUserError'
 *                 - $ref: '#/components/schemas/InvalidUUIDFormatError'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvalidCredentialsError'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserNotFoundError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */

export const deleteUser = async (request: Request, response: Response) => {
  try {
    const { userId } = request.user;
    const { password } = request.body as { password?: string };

    if (!userId || !password) {
      return response.status(400).json({
        code: "INVALID_INPUT",
        message: "userId and password are required",
      });
    }

    if (!isValidUUID(userId)) {
      return response.status(400).json({
        code: "INVALID_UUID_FORMAT",
        message: "Invalid UUID format for userId",
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

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return response.status(401).json({
        code: "INVALID_CREDENTIALS",
        message: "Invalid password",
      });
    }

    await user.destroy();

    return response.status(200).json({
      message: "User successfully deleted",
    });
  } catch (error) {
    logger.error(error);
    return response.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred",
    });
  }
};
