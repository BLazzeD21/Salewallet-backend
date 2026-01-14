import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import models from "../models/index.js";

const SALT_ROUNDS = 10;

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, mail, password } = req.body;

    if (!username || !mail || !password) {
      return res
        .status(400)
        .json({ message: "Username, mail and password are required" });
    }

    const usernameTaken = await models.user.findOne({ where: { username } });

    if (usernameTaken) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const mailTaken = await models.user.findOne({ where: { mail } });
    if (mailTaken) {
      return res.status(400).json({ message: "Mail already exists" });
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

    res.status(201).json({
      user: {
        user_id: user.user_id,
        username: user.username,
        mail: user.mail,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ message: "Username or mail already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};
