export default {
  InternalServerError: {
    type: "object",
    properties: {
      code: { type: "string", example: "INTERNAL_SERVER_ERROR" },
      message: { type: "string", example: "An internal server error occurred" },
    },
  },

  InvalidInputError: {
    type: "object",
    properties: {
      code: { type: "string", example: "INVALID_INPUT" },
      message: {
        type: "string",
        example: "username and password are required",
      },
    },
  },

  InvalidCredentialsError: {
    type: "object",
    properties: {
      code: { type: "string", example: "INVALID_CREDENTIALS" },
      message: { type: "string", example: "Invalid credentials" },
    },
  },

  EmailNotConfirmedError: {
    type: "object",
    properties: {
      code: { type: "string", example: "EMAIL_NOT_CONFIRMED" },
      message: { type: "string", example: "Email is not confirmed" },
    },
  },

  RefreshTokenRequiredError: {
    type: "object",
    properties: {
      code: { type: "string", example: "REFRESH_TOKEN_REQUIRED" },
      message: { type: "string", example: "Refresh token is required" },
    },
  },

  InvalidRefreshTokenError: {
    type: "object",
    properties: {
      code: { type: "string", example: "INVALID_REFRESH_TOKEN" },
      message: { type: "string", example: "Invalid or expired refresh token" },
    },
  },

  InvalidEmailError: {
    type: "object",
    properties: {
      code: { type: "string", example: "INVALID_EMAIL" },
      message: { type: "string", example: "Invalid email format" },
    },
  },

  CredentialsConflictError: {
    type: "object",
    properties: {
      code: { type: "string", example: "CREDENTIALS_CONFLICT" },
      message: {
        type: "string",
        example: "Username and mail belong to different users",
      },
    },
  },

  UserAlreadyConfirmedError: {
    type: "object",
    properties: {
      code: { type: "string", example: "USER_ALREADY_CONFIRMED" },
      message: {
        type: "string",
        example: "User already exists and is confirmed",
      },
    },
  },

  ValidationError: {
    type: "object",
    properties: {
      code: { type: "string", example: "VALIDATION_ERROR" },
      message: { type: "string", example: "Validation failed" },
    },
  },

  InvalidInputRegisterError: {
    type: "object",
    properties: {
      code: { type: "string", example: "INVALID_INPUT" },
      message: {
        type: "string",
        example: "Username, mail, and password are required",
      },
    },
  },

  InvalidCardIdError: {
    type: "object",
    properties: {
      code: { type: "string", example: "INVALID_CARD_ID" },
      message: { type: "string", example: "Invalid cardId (UUID expected)" },
    },
  },

  InvalidUserIdError: {
    type: "object",
    properties: {
      code: { type: "string", example: "INVALID_USER_ID" },
      message: {
        type: "string",
        example: "Invalid or missing userId (UUID expected)",
      },
    },
  },

  InvalidTokenInputError: {
    type: "object",
    properties: {
      code: { type: "string", example: "INVALID_INPUT" },
      message: { type: "string", example: "Token is required" },
    },
  },

  InvalidTokenError: {
    type: "object",
    properties: {
      code: { type: "string", example: "INVALID_TOKEN" },
      message: { type: "string", example: "Token cannot be empty or invalid" },
    },
  },

  TokenExpiredError: {
    type: "object",
    properties: {
      code: { type: "string", example: "TOKEN_EXPIRED" },
      message: { type: "string", example: "Verification token expired" },
    },
  },

  TokenNotFoundError: {
    type: "object",
    properties: {
      code: { type: "string", example: "TOKEN_NOT_FOUND" },
      message: { type: "string", example: "Verification token not found" },
    },
  },

  InvalidUUIDFormatError: {
    type: "object",
    properties: {
      code: { type: "string", example: "INVALID_UUID_FORMAT" },
      message: { type: "string", example: "Invalid UUID format for userId" },
    },
  },

  InvalidInputDeleteUserError: {
    type: "object",
    properties: {
      code: { type: "string", example: "INVALID_INPUT" },
      message: { type: "string", example: "userId and password are required" },
    },
  },

  InvalidInputChangePasswordError: {
    type: "object",
    properties: {
      code: { type: "string", example: "INVALID_INPUT" },
      message: {
        type: "string",
        example: "oldPassword and newPassword are required",
      },
    },
  },

  InvalidOldPasswordError: {
    type: "object",
    properties: {
      code: { type: "string", example: "INVALID_OLD_PASSWORD" },
      message: { type: "string", example: "Old password is incorrect" },
    },
  },

  UserNotFoundError: {
    type: "object",
    properties: {
      code: { type: "string", example: "USER_NOT_FOUND" },
      message: { type: "string", example: "User not found" },
    },
  },

  NoCardsFoundError: {
    type: "object",
    properties: {
      code: { type: "string", example: "CARD_NOT_FOUND" },
      message: { type: "string", example: "No cards found for this user" },
    },
  },

  InvalidInputCardError: {
    type: "object",
    properties: {
      code: { type: "string", example: "INVALID_INPUT" },
      message: {
        type: "string",
        example: "card_number, name, barcode, barcode_type, and qr_data are required",
      },
    },
  },

  DuplicateEntryError: {
    type: "object",
    properties: {
      code: { type: "string", example: "DUPLICATE_ENTRY" },
      message: { type: "string", example: "card_number already exists" },
    },
  },

  NoUpdateFieldsError: {
    type: "object",
    properties: {
      code: { type: "string", example: "NO_UPDATE_FIELDS" },
      message: {
        type: "string",
        example: "At least one field must be provided for update",
      },
    },
  },

  InvalidBarcodeUpdateError: {
    type: "object",
    properties: {
      code: { type: "string", example: "INVALID_BARCODE_UPDATE" },
      message: {
        type: "string",
        example: "barcode, barcode_type and qr_data must be provided together",
      },
    },
  },

  CardNotFoundError: {
    type: "object",
    properties: {
      code: { type: "string", example: "CARD_NOT_FOUND" },
      message: {
        type: "string",
        example: "Card not found or does not belong to user",
      },
    },
  },

  InvalidInputDeleteError: {
    type: "object",
    properties: {
      code: { type: "string", example: "INVALID_INPUT" },
      message: { type: "string", example: "userId and cardId are required" },
    },
  },

  NoFileProvided: {
    type: "object",
    properties: {
      code: { type: "string", example: "NO_FILE_PROVIDED" },
      message: { type: "string", example: "File is required" },
    },
  },

  InvalidNameInput: {
    type: "object",
    properties: {
      code: { type: "string", example: "INVALID_INPUT" },
      message: { type: "string", example: "Name is required" },
    },
  },

  InvalidFileType: {
    type: "object",
    properties: {
      code: { type: "string", example: "INVALID_FILE_TYPE" },
      message: { type: "string", example: "Only PNG and JPEG allowed" },
    },
  },

  FileTooLarge: {
    type: "object",
    properties: {
      code: { type: "string", example: "FILE_TOO_LARGE" },
      message: { type: "string", example: "File must be <= 5MB" },
    },
  },

  DuplicateName: {
    type: "object",
    properties: {
      code: { type: "string", example: "DUPLICATE_NAME" },
      message: {
        type: "string",
        example: "A picture with this name already exists",
      },
    },
  },

  NothingToDelete: {
    type: "object",
    properties: {
      code: { type: "string", example: "NOTHING_TO_DELETE" },
      message: {
        type: "string",
        example: "Neither file nor database record exists",
      },
    },
  },

  NoPathProvided: {
    type: "object",
    properties: {
      code: { type: "string", example: "NO_PATH_PROVIDED" },
      message: {
        type: "string",
        example: "Valid path is required",
      },
    },
  },

  FileDeletionFailed: {
    type: "object",
    properties: {
      code: { type: "string", example: "FILE_DELETION_FAILED" },
      message: {
        type: "string",
        example: "Failed to delete file from storage",
      },
    },
  },
};
