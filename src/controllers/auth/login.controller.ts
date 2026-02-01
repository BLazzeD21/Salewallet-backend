import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

import models from "@/models";

import type { UserWithCards } from "@/types";

/**
 * @openapi
 * /user/login:
 *   post:
 *     tags:
 *       - User
 *     summary: User login
 *     description: Authenticate user by username or email and password. Returns access and refresh tokens with user data including cards.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvalidInputError'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvalidCredentialsError'
 *       403:
 *         description: Email not confirmed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailNotConfirmedError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */

export const login = async (request: Request, response: Response) => {
  try {
    let { username, password } = request.body as {
      username?: string;
      password?: string;
    };

    username = username.toLocaleLowerCase();

    if (!username || !password) {
      return response.status(400).json({
        code: "INVALID_INPUT",
        message: "username and password are required",
      });
    }

    const user = (await models.user.findOne({
      where: {
        [Op.or]: [{ username }, { mail: username }],
      },
      include: [
        {
          model: models.card,
          as: "cards",
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
          order: [["added_at", "DESC"]],
        },
      ],
    })) as UserWithCards;

    if (!user) {
      return response.status(401).json({
        code: "INVALID_CREDENTIALS",
        message: "Invalid username or password",
      });
    }

    if (!user.confirmed) {
      return response.status(403).json({
        code: "EMAIL_NOT_CONFIRMED",
        message: "Email is not confirmed",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return response.status(401).json({
        code: "INVALID_CREDENTIALS",
        message: "Invalid username or password",
      });
    }

    const accessToken = jwt.sign({ sub: user.user_id }, process.env.AUTH_SECRET, {
      expiresIn: Number(process.env.AUTH_SECRET_EXPIRES_IN),
    });

    const refreshToken = jwt.sign({ sub: user.user_id }, process.env.AUTH_REFRESH_SECRET, {
      expiresIn: Number(process.env.AUTH_REFRESH_SECRET_EXPIRES_IN),
    });

    return response.status(200).json({
      tokens: {
        accessToken,
        refreshToken,
        token_type: "bearer",
      },
      data: {
        user_id: user.user_id,
        username: user.username,
        mail: user.mail,
        cards: user.cards || [],
      },
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred",
    });
  }
};
