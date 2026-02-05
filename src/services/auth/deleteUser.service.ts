import bcrypt from "bcrypt";

import models from "@/models";

import type { DeleteUserRequest, DeleteUserResponse } from "@/types";

import { InvalidDeleteCredentialsError, InvalidInputError, InvalidUUIDFormatError, UserNotFoundError } from "@/errors";

import { isValidUUID } from "@/utils";

export const deleteUser = async (request: DeleteUserRequest): Promise<DeleteUserResponse> => {
  const { userId, password } = request;

  if (!userId || !password) {
    throw new InvalidInputError();
  }

  if (!isValidUUID(userId)) {
    throw new InvalidUUIDFormatError();
  }

  const user = await models.user.findOne({ where: { user_id: userId } });
  if (!user) {
    throw new UserNotFoundError();
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new InvalidDeleteCredentialsError();
  }

  await user.destroy();

  return { message: "User successfully deleted" };
};
