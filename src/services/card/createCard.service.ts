import { Op, ValidationError } from "sequelize";

import models from "@/models";

import type { BarcodeType, CreateCardRequest, CreateCardResponse } from "@/types";

import {
  DuplicateEntryError,
  InvalidCardInputError,
  InvalidUserIdError,
  UserNotFoundError,
  ValidationErrorApp,
} from "@/errors";

import { isValidUUID } from "@/utils";

export const createCard = async (request: CreateCardRequest): Promise<CreateCardResponse> => {
  const { userId, card_number, name, description, color, barcode, barcode_type, qr_data } = request;

  if (!userId || !isValidUUID(userId)) {
    throw new InvalidUserIdError();
  }

  if (!card_number || !name || !barcode || !barcode_type || !qr_data) {
    throw new InvalidCardInputError();
  }

  const user = await models.user.findByPk(userId);
  if (!user) {
    throw new UserNotFoundError();
  }

  const existingCard = await models.card.findOne({
    where: {
      user_id: userId,
      [Op.or]: [{ card_number }, { barcode }, { qr_data }],
    },
  });

  if (existingCard) {
    let field = "";
    if (existingCard.card_number === card_number) field = "card_number";
    else if (existingCard.barcode === barcode) field = "barcode";
    else if (existingCard.qr_data === qr_data) field = "qr_data";

    throw new DuplicateEntryError(field);
  }

  try {
    const card = await models.card.create({
      user_id: userId,
      card_number,
      name,
      description,
      color,
      barcode,
      barcode_type,
      qr_data,
    });

    return {
      card: {
        card_id: card.card_id,
        card_number: card.card_number,
        name: card.name,
        description: card.description,
        color: card.color,
        barcode: card.barcode,
        barcode_type: card.barcode_type as BarcodeType,
        qr_data: card.qr_data,
        added_at: card.added_at,
      },
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ValidationErrorApp(error.errors[0].message);
    }
    throw error;
  }
};
