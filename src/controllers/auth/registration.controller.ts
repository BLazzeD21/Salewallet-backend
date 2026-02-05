import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { ValidationError } from "sequelize";
import { v4 as uuidv4 } from "uuid";

import { getMailOptions, getTransporter, logger } from "@/config";

import models from "@/models";

import type { User } from "@/types";

import { isValidEmail } from "@/utils";

const SALT_ROUNDS = 10;

export const registerUser = async (request: Request, response: Response) => {
  const transaction = await models.sequelize.transaction();

  try {
    let { username, mail, password } = request.body as {
      username: string;
      mail: string;
      password: string;
    };

    username = username.toLocaleLowerCase();
    mail = mail.toLocaleLowerCase();

    if (!username || !mail || !password) {
      return response.status(400).json({
        code: "INVALID_INPUT",
        message: "Username, mail, and password are required",
      });
    }

    if (!isValidEmail(mail)) {
      return response.status(400).json({
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
      return response.status(400).json({
        code: "CREDENTIALS_CONFLICT",
        message: "Username and mail belong to different users",
      });
    }

    const existingUser = userByUsername || userByMail;

    if (existingUser?.confirmed) {
      return response.status(400).json({
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

    const mailOptions = getMailOptions(mail, token, user.user_id, username);

    await transporter.sendMail(mailOptions);

    await transaction.commit();

    return response.status(201).json({
      user: {
        user_id: user.user_id,
        username: user.username,
        mail: user.mail,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    logger.error(error);
    await transaction.rollback();

    if (error instanceof ValidationError) {
      return response.status(400).json({
        code: "VALIDATION_ERROR",
        message: error.errors[0].message,
      });
    }

    return response.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    });
  }
};
