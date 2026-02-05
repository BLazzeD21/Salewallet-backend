import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import { getMailOptions, getTransporter } from "@/config";

import models from "@/models";

import type { RegisterRequest, RegisterResponse, User } from "@/types";

import {
  CredentialsConflictError,
  InvalidEmailError,
  InvalidRegisterInputError,
  UserAlreadyConfirmedError,
} from "@/errors";

import { isValidEmail } from "@/utils";

const SALT_ROUNDS = 10;

export const register = (request: RegisterRequest): Promise<RegisterResponse> => {
  return models.sequelize.transaction(async (transaction) => {
    let { username, mail, password } = request;

    if (!username || !mail || !password) {
      throw new InvalidRegisterInputError();
    }

    username = username.toLowerCase();
    mail = mail.toLowerCase();

    if (!isValidEmail(mail)) {
      throw new InvalidEmailError();
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
      throw new CredentialsConflictError();
    }

    const existingUser: User | null = userByUsername ?? userByMail;

    if (existingUser?.confirmed) {
      throw new UserAlreadyConfirmedError();
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    let user: User;

    if (existingUser) {
      user = await existingUser.update(
        {
          username,
          mail,
          password: hashedPassword,
          created_at: new Date(),
        },
        { transaction },
      );

      await models.email_verification.destroy({
        where: { user_id: existingUser.user_id },
        transaction,
      });
    } else {
      user = await models.user.create({ username, mail, password: hashedPassword }, { transaction });
    }

    const token = uuidv4();

    await models.email_verification.create(
      {
        user_id: user.user_id,
        token,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      { transaction },
    );

    const transporter = await getTransporter();

    const mailOptions = getMailOptions(mail, token, user.user_id, username);

    await transporter.sendMail(mailOptions);

    return {
      user: {
        user_id: user.user_id,
        username: user.username,
        mail: user.mail,
        created_at: user.created_at,
      },
    };
  });
};
