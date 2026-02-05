import type { Response } from "express";

import { logger } from "@/config";

import { AppError } from "@/errors";

export const sendError = (error: Error, response: Response) => {
  logger.error(error);

  if (error instanceof AppError) {
    return response.status(error.status).json({
      code: error.code,
      message: error.message,
    });
  }

  return response.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong",
  });
};
