import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { Op } from "sequelize";
import models from "../models/index.js";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body as {
      username?: string;
      password?: string;
    };

    if (!username || !password) {
      return res.status(400).json({
        code: "INVALID_INPUT",
        message: "username and password are required",
      });
    }

    const user = await models.user.findOne({
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
        },
      ],
    });

    if (!user) {
      return res.status(401).json({
        code: "INVALID_CREDENTIALS",
        message: "Invalid username or password",
      });
    }

    if (!user.confirmed) {
      return res.status(403).json({
        code: "EMAIL_NOT_CONFIRMED",
        message: "Email is not confirmed",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        code: "INVALID_CREDENTIALS",
        message: "Invalid username or password",
      });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        user_id: user.user_id,
        username: user.username,
        mail: user.mail,
        cards: user.cards || [],
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred",
    });
  }
};
