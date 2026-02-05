import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

import models from "@/models";

import type { LoginRequest, LoginResponse, UserWithCards } from "@/types";

import { EmailNotConfirmedError, InvalidCredentialsError, InvalidLoginInputError } from "@/errors";

export const login = async (request: LoginRequest): Promise<LoginResponse> => {
  let { username, password } = request;

  if (!username || !password) {
    throw new InvalidLoginInputError();
  }

  username = username.toLowerCase();

  const user = (await models.user.findOne({
    where: { [Op.or]: [{ username }, { mail: username }] },
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
  })) as UserWithCards | null;

  if (!user) {
    throw new InvalidCredentialsError();
  }

  if (!user.confirmed) {
    throw new EmailNotConfirmedError();
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new InvalidCredentialsError();
  }

  const accessToken = jwt.sign({ sub: user.user_id }, process.env.AUTH_SECRET, {
    expiresIn: Number(process.env.AUTH_SECRET_EXPIRES_IN),
  });

  const refreshToken = jwt.sign({ sub: user.user_id }, process.env.AUTH_REFRESH_SECRET, {
    expiresIn: Number(process.env.AUTH_REFRESH_SECRET_EXPIRES_IN),
  });

  return {
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
  };
};
