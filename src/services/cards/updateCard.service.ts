import { ValidationError } from "sequelize";

import models from "@/models";

import type { UpdateCardRequest, UpdateCardResponse } from "@/types";

import {
  CardNotFoundError,
  InvalidBarcodeUpdateError,
  InvalidCardIdError,
  InvalidUserIdError,
  NoUpdateFieldsError,
  ValidationErrorApp,
} from "@/errors";

import { isValidUUID } from "@/utils";

export const updateCard = async (request: UpdateCardRequest): Promise<UpdateCardResponse> => {
  const { userId, cardId, name, description, color, card_number, barcode, barcode_type, qr_data } = request;

  if (!isValidUUID(cardId)) {
    throw new InvalidCardIdError();
  }

  if (!isValidUUID(userId)) {
    throw new InvalidUserIdError();
  }

  const hasUpdatableFields =
    name !== undefined ||
    description !== undefined ||
    color !== undefined ||
    card_number !== undefined ||
    barcode !== undefined ||
    barcode_type !== undefined ||
    qr_data !== undefined;

  if (!hasUpdatableFields) {
    throw new NoUpdateFieldsError();
  }

  const barcodeFields = [barcode, barcode_type, qr_data];
  const providedCount = barcodeFields.filter((v) => v !== undefined).length;
  if (providedCount !== 0 && providedCount !== 3) {
    throw new InvalidBarcodeUpdateError();
  }

  const card = await models.card.findOne({
    where: { card_id: cardId, user_id: userId },
  });

  if (!card) {
    throw new CardNotFoundError();
  }

  const updateData: Record<string, string> = {
    ...(name !== undefined && { name }),
    ...(description !== undefined && { description }),
    ...(color !== undefined && { color }),
    ...(card_number !== undefined && { card_number }),
  };

  if (providedCount === 3) {
    Object.assign(updateData, { barcode, barcode_type, qr_data });
  }

  try {
    const updatedCard = await card.update(updateData);

    const { user_id, ...cardData } = updatedCard.get({ plain: true });
    return { message: "Card updated successfully", data: cardData };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ValidationErrorApp(error.errors[0].message);
    }
    throw error;
  }
};
