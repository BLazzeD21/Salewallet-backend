import models from "@/models";

import type { DeleteCardRequest, DeleteCardResponse } from "@/types";

import { CardNotFoundError, InvalidDeleteInputError, InvalidDeleteUUIDFormatError, UserNotFoundError } from "@/errors";

import { isValidUUID } from "@/utils";

export const deleteCard = async (request: DeleteCardRequest): Promise<DeleteCardResponse> => {
  const { userId, cardId } = request;

  if (!userId || !cardId) {
    throw new InvalidDeleteInputError();
  }

  if (!isValidUUID(userId) || !isValidUUID(cardId)) {
    throw new InvalidDeleteUUIDFormatError();
  }

  const user = await models.user.findByPk(userId);
  if (!user) {
    throw new UserNotFoundError();
  }

  const card = await models.card.findOne({
    where: { card_id: cardId, user_id: userId },
  });

  if (!card) {
    throw new CardNotFoundError();
  }

  await card.destroy();

  return { message: "Card successfully deleted" };
};
