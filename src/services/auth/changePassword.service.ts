import bcrypt from "bcrypt";

import models from "@/models";

import type { ChangePasswordRequest, ChangePasswordResponse } from "@/types";

import { InvalidOldPasswordError, InvalidPasswordsInputError, InvalidUserIdError, UserNotFoundError } from "@/errors";

import { isValidUUID } from "@/utils";

export const changePassword = async (request: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
  const { userId, oldPassword, newPassword } = request;

  if (!userId || !isValidUUID(userId)) {
    throw new InvalidUserIdError();
  }

  if (!oldPassword || !newPassword) {
    throw new InvalidPasswordsInputError();
  }

  const user = await models.user.findByPk(userId);

  if (!user) {
    throw new UserNotFoundError();
  }

  const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isOldPasswordValid) {
    throw new InvalidOldPasswordError();
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  await user.save();

  return { code: "PASSWORD_CHANGED", message: "Password changed successfully" };
};
