import models from "@/models";

import type { ConfirmEmailRequest } from "@/types";

import {
  InvalidTokenError,
  InvalidUserIdError,
  TokenExpiredError,
  TokenNotFoundError,
  TokenRequiredError,
  UserNotFoundError,
} from "@/errors";

import { confirmedHTML } from "@/html";

import { isValidUUID } from "@/utils";

export const confirmEmail = async (request: ConfirmEmailRequest): Promise<string> => {
  const { userId, token } = request;

  if (!userId || !isValidUUID(userId)) {
    throw new InvalidUserIdError();
  }

  if (!token) {
    throw new TokenRequiredError();
  }

  if (token.trim().length === 0) {
    throw new InvalidTokenError();
  }

  const user = await models.user.findOne({ where: { user_id: userId } });
  if (!user) {
    throw new UserNotFoundError();
  }

  const verification = await models.email_verification.findOne({
    where: { user_id: user.user_id, confirmed: false },
  });

  if (!verification) {
    throw new TokenNotFoundError();
  }

  if (verification.expires_at < new Date()) {
    throw new TokenExpiredError();
  }

  if (verification.token !== token) {
    throw new InvalidTokenError();
  }

  user.confirmed = true;
  await user.save();

  await models.email_verification.destroy({ where: { user_id: user.user_id } });

  return confirmedHTML;
};
