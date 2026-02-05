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
    super("INVALID_CREDENTIALS", 401, "Invalid username or password");
  }
}

export class EmailNotConfirmedError extends AppError {
  constructor() {
    super("EMAIL_NOT_CONFIRMED", 403, "Email is not confirmed");
  }
}
