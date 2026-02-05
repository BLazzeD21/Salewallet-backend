import { AppError } from "./AppError";

export class InvalidUserIdError extends AppError {
  constructor() {
    super("INVALID_USER_ID", 400, "Invalid or missing userId (UUID expected)");
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super("USER_NOT_FOUND", 404, "User not found");
  }
}

export class InvalidInputError extends AppError {
  constructor() {
    super("INVALID_INPUT", 400, "userId and password are required");
  }
}

export class InvalidUUIDFormatError extends AppError {
  constructor() {
    super("INVALID_UUID_FORMAT", 400, "Invalid UUID format for userId");
  }
}

export class InvalidDeleteCredentialsError extends AppError {
  constructor() {
    super("INVALID_CREDENTIALS", 401, "Invalid password");
  }
}

export class InvalidPasswordsInputError extends AppError {
  constructor() {
    super("INVALID_INPUT", 400, "oldPassword and newPassword are required");
  }
}

export class InvalidOldPasswordError extends AppError {
  constructor() {
    super("INVALID_OLD_PASSWORD", 401, "Old password is incorrect");
  }
}
