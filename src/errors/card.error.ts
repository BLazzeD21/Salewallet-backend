import { AppError } from "./AppError";

export class InvalidCardInputError extends AppError {
  constructor() {
    super("INVALID_INPUT", 400, "card_number, name, barcode, barcode_type, and qr_data are required");
  }
}

export class DuplicateEntryError extends AppError {
  constructor(field: string) {
    super("DUPLICATE_ENTRY", 400, `${field} already exists`);
  }
}

export class ValidationErrorApp extends AppError {
  constructor(message: string) {
    super("VALIDATION_ERROR", 400, message);
  }
}

export class CardNotFoundError extends AppError {
  constructor() {
    super("CARD_NOT_FOUND", 404, "Card not found for this user");
  }
}

export class InvalidDeleteInputError extends AppError {
  constructor() {
    super("INVALID_INPUT", 400, "cardId is required");
  }
}

export class InvalidDeleteUUIDFormatError extends AppError {
  constructor() {
    super("INVALID_UUID_FORMAT", 400, "Invalid UUID format for cardId");
  }
}

export class InvalidCardIdError extends AppError {
  constructor() {
    super("INVALID_CARD_ID", 400, "Invalid cardId (UUID expected)");
  }
}

export class NoUpdateFieldsError extends AppError {
  constructor() {
    super("NO_UPDATE_FIELDS", 400, "At least one field must be provided for update");
  }
}

export class InvalidBarcodeUpdateError extends AppError {
  constructor() {
    super("INVALID_BARCODE_UPDATE", 400, "barcode, barcode_type and qr_data must be provided together");
  }
}

export class CardForUpdateNotFoundError extends AppError {
  constructor() {
    super("CARD_NOT_FOUND", 404, "Card not found or does not belong to user");
  }
}
