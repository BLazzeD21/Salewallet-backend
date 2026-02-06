import { AppError } from "./AppError";

export class InvalidRegisterInputError extends AppError {
  constructor() {
    super("INVALID_INPUT", 400, "Username, mail, and password are required");
  }
}

export class InvalidEmailError extends AppError {
  constructor() {
    super("INVALID_EMAIL", 400, "Invalid email format");
  }
}

export class CredentialsConflictError extends AppError {
  constructor() {
    super("CREDENTIALS_CONFLICT", 400, "Username and mail belong to different users");
  }
}

export class UserAlreadyConfirmedError extends AppError {
  constructor() {
    super("USER_ALREADY_CONFIRMED", 400, "User already exists and is confirmed");
  }
}

export class InvalidLoginInputError extends AppError {
  constructor() {
    super("INVALID_INPUT", 400, "Username and password are required");
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super("INVALID_CREDENTIALS", 401, "Invalid credentials");
  }
}

export class EmailNotConfirmedError extends AppError {
  constructor() {
    super("EMAIL_NOT_CONFIRMED", 403, "Email is not confirmed");
  }
}

export class RefreshTokenRequiredError extends AppError {
  constructor() {
    super("REFRESH_TOKEN_REQUIRED", 400, "Refresh token is required");
  }
}

export class InvalidRefreshTokenError extends AppError {
  constructor() {
    super("INVALID_REFRESH_TOKEN", 401, "Invalid or expired refresh token");
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super("UNAUTHORIZED", 401, "Token not found or malformed");
  }
}

export class TokenExpiredError extends AppError {
  constructor() {
    super("TOKEN_EXPIRED", 400, "Verification token expired");
  }
}

export class TokenNotFoundError extends AppError {
  constructor() {
    super("TOKEN_NOT_FOUND", 404, "Verification token not found");
  }
}

export class InvalidTokenError extends AppError {
  constructor() {
    super("INVALID_TOKEN", 400, "Invalid verification token");
  }
}

export class TokenRequiredError extends AppError {
  constructor() {
    super("INVALID_INPUT", 400, "Token is required");
  }
}
