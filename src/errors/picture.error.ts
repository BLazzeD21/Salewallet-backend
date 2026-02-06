import { AppError } from "./AppError";

export class InvalidNameInputError extends AppError {
  constructor() {
    super("INVALID_NAME_INPUT", 400, "name query parameter is required");
  }
}

export class NoPathProvidedError extends AppError {
  constructor() {
    super("NO_PATH_PROVIDED", 400, "Valid path is required");
  }
}

export class NothingToDeleteError extends AppError {
  constructor() {
    super("NOTHING_TO_DELETE", 404, "Neither file nor database record exists");
  }
}

export class FileDeletionFailedError extends AppError {
  constructor() {
    super("FILE_DELETION_FAILED", 500, "Failed to delete file from storage");
  }
}

export class NoFileProvidedError extends AppError {
  constructor() {
    super("NO_FILE_PROVIDED", 400, "File is required");
  }
}

export class InvalidPictureNameError extends AppError {
  constructor() {
    super("INVALID_INPUT", 400, "Name is required");
  }
}

export class InvalidFileTypeError extends AppError {
  constructor() {
    super("INVALID_FILE_TYPE", 400, "Only PNG and JPEG allowed");
  }
}

export class FileTooLargeError extends AppError {
  constructor() {
    super("FILE_TOO_LARGE", 400, "File must be <= 5MB");
  }
}

export class DuplicatePictureNameError extends AppError {
  constructor() {
    super("DUPLICATE_NAME", 409, "A picture with this name already exists");
  }
}
