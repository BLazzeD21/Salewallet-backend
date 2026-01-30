import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import nodemailer from "nodemailer";
import { ValidationError } from "sequelize";
import { v4 as uuidv4 } from "uuid";

import models from "@/models";

import type { User } from "@/types";

import { confirmHTML } from "@/html";

import { isValidEmail } from "@/utils";

const SALT_ROUNDS = 10;

let transporter: nodemailer.Transporter;

async function getTransporter(): Promise<nodemailer.Transporter> {
  if (transporter && (await transporter.verify())) {
    return transporter;
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USERNAME || !process.env.SMTP_PASSWORD) {
    throw new Error("SMTP credentials are not configured");
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    requireTLS: true,
    secure: false,
    logger: true,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: 10000,
    socketTimeout: 10000,
    greetingTimeout: 5000,
  });

  return transporter;
}

/**
 * @openapi
 * /user/register:
 *   post:
 *     tags:
 *       - User
 *     summary: Register a new user
 *     description: >
 *       Registers a new user with username, email, and password.
 *       Sends a confirmation email with a verification token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Invalid input or user conflict
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/InvalidInputError'
 *                 - $ref: '#/components/schemas/InvalidEmailError'
 *                 - $ref: '#/components/schemas/CredentialsConflictError'
 *                 - $ref: '#/components/schemas/UserAlreadyConfirmedError'
 *                 - $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */

export const registerUser = async (req: Request, res: Response) => {
  const transaction = await models.sequelize.transaction();

  try {
    const { username, mail, password } = req.body;

    if (!username || !mail || !password) {
      return res.status(400).json({
        code: "INVALID_INPUT",
        message: "Username, mail, and password are required",
      });
    }

    if (!isValidEmail(mail)) {
      return res.status(400).json({
        code: "INVALID_EMAIL",
        message: "Invalid email format",
      });
    }

    const userByUsername = await models.user.findOne({
      where: { username },
      transaction,
    });

    const userByMail = await models.user.findOne({
      where: { mail },
      transaction,
    });

    if (userByUsername && userByMail && userByUsername.user_id !== userByMail.user_id) {
      return res.status(400).json({
        code: "CREDENTIALS_CONFLICT",
        message: "Username and mail belong to different users",
      });
    }

    const existingUser = userByUsername || userByMail;

    if (existingUser?.confirmed) {
      return res.status(400).json({
        code: "USER_ALREADY_CONFIRMED",
        message: "User already exists and is confirmed",
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    let user: User;

    if (existingUser) {
      await existingUser.update(
        {
          username,
          mail,
          password: hashedPassword,
          created_at: new Date(),
        },
        { transaction },
      );

      await models.email_verification.destroy({
        where: {
          user_id: existingUser.user_id,
        },
        transaction,
      });

      user = existingUser;
    } else {
      user = await models.user.create(
        {
          username,
          mail,
          password: hashedPassword,
        },
        { transaction },
      );
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await models.email_verification.create(
      {
        user_id: user.user_id,
        token,
        expires_at: expiresAt,
      },
      { transaction },
    );

    const transporter = await getTransporter();

    const mailOptions = {
      from: `"SaleWallet" <${process.env.FROM_EMAIL_USERNAME}>`,
      to: mail,
      subject: `Подтверждение почты для SaleWallet`,
      html: confirmHTML(token, user.user_id, username),
      date: new Date(),
    };

    await transporter.sendMail(mailOptions);

    await transaction.commit();

    return res.status(201).json({
      user: {
        user_id: user.user_id,
        username: user.username,
        mail: user.mail,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    await transaction.rollback();

    if (error instanceof ValidationError) {
      return res.status(400).json({
        code: "VALIDATION_ERROR",
        message: error.errors[0].message,
      });
    }

    return res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    });
  }
};
