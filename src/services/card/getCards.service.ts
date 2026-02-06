import models from "@/models";

import type { GetCardsRequest, GetCardsResponse } from "@/types";

import { InvalidUserIdError, UserNotFoundError } from "@/errors";

import { isValidUUID } from "@/utils";

export const getCards = async (request: GetCardsRequest): Promise<GetCardsResponse> => {
  const { userId } = request;

  if (!userId || !isValidUUID(userId)) {
    throw new InvalidUserIdError();
  }

  const user = await models.user.findByPk(userId);
  if (!user) {
    throw new UserNotFoundError();
  }

  const cards = await models.card.findAll({
    where: { user_id: userId },
    order: [["added_at", "DESC"]],
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
  });

  return {
    user_id: userId,
    cards,
  };
};
