import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import models from "../models/index.js";
import { ErrorResponse } from "../types/types.js";

const SALT_ROUNDS = 10;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operations related to users
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - mail
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: Alexandr
 *               mail:
 *                 type: string
 *                 format: email
 *                 example: alexandr@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistrationResponse'
 *       400:
 *         description: Validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           example: INVALID_INPUT
 *         message:
 *           type: string
 *           example: Username, mail, and password are required
 *     RegistrationResponse:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             user_id:
 *               type: string
 *             username:
 *               type: string
 *             mail:
 *               type: string
 *             created_at:
 *               type: string
 *               format: date-time
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, mail, password } = req.body;

    if (!username || !mail || !password) {
      const error: ErrorResponse = {
        code: "INVALID_INPUT",
        message: "Username, mail, and password are required",
      };
      return res.status(400).json(error);
    }

    const usernameTaken = await models.user.findOne({ where: { username } });
    if (usernameTaken) {
      return res.status(400).json({
        code: "USERNAME_TAKEN",
        message: "Username already exists",
      });
    }

    const mailTaken = await models.user.findOne({ where: { mail } });
    if (mailTaken) {
      return res.status(400).json({
        code: "MAIL_TAKEN",
        message: "Mail already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await models.user.create({
      username,
      mail,
      password: hashedPassword,
    });

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await models.email_verification.create({
      user_id: user.user_id,
      token,
      expires_at: expiresAt,
    });

    return res.status(201).json({
      user: {
        user_id: user.user_id,
        username: user.username,
        mail: user.mail,
        created_at: user.created_at,
      },
    });
  } catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        code: "DUPLICATE_ENTRY",
        message: "Username or mail already exists",
      });
    }

    return res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    });
  }
};
