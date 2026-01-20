import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import models from "../models/index.js";

const SALT_ROUNDS = 10;

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, mail, password } = req.body;

    if (!username || !mail || !password) {
      return res.status(400).json({
        code: "INVALID_INPUT",
        message: "Username, mail, and password are required",
      });
    }

    const userByUsername = await models.user.findOne({ where: { username } });
    const userByMail = await models.user.findOne({ where: { mail } });

    if (
      userByUsername &&
      userByMail &&
      userByUsername.user_id !== userByMail.user_id
    ) {
      return res.status(400).json({
        code: "CREDENTIALS_CONFLICT",
        message: "Username and mail belong to different users",
      });
    }

    const existingUser = userByUsername || userByMail;

    if (existingUser && existingUser.confirmed) {
      return res.status(400).json({
        code: "USER_ALREADY_CONFIRMED",
        message: "User already exists and is confirmed",
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    let user;

    if (existingUser) {
      await existingUser.update({
        username,
        mail,
        password: hashedPassword,
        created_at: new Date(),
      });

      await models.email_verification.destroy({
        where: { user_id: existingUser.user_id },
      });

      user = existingUser;
    } else {
      user = await models.user.create({
        username,
        mail,
        password: hashedPassword,
      });
    }

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
  } catch (error) {
    return res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    });
  }
};
