import fs from "node:fs";
import path, { join } from "node:path";

import type { Request, Response } from "express";

import { logger } from "@/config";

import models from "@/models";

export const uploadPicture = async (request: Request, response: Response) => {
  try {
    const uploadDir = join(process.cwd(), "public", "suggestions");

    const file = request.file;

    if (!file) {
      return response.status(400).json({ code: "NO_FILE_PROVIDED", message: "File is required" });
    }

    const { name } = request.body as {
      name: string;
    };

    if (!name) {
      return response.status(400).json({ code: "INVALID_INPUT", message: "Name is required" });
    }

    if (!["image/png", "image/jpeg"].includes(file.mimetype)) {
      return response.status(400).json({
        code: "INVALID_FILE_TYPE",
        message: "Only PNG and JPEG allowed",
      });
    }

    if (file.size > 5 * 1024 * 1024) {
      return response.status(400).json({ code: "FILE_TOO_LARGE", message: "File must be <= 5MB" });
    }

    const existingFile = await models.picture.findOne({ where: { name } });

    if (existingFile) {
      return response.status(409).json({
        code: "DUPLICATE_NAME",
        message: "A picture with this name already exists",
      });
    }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = file.originalname.split(".").pop();

    const filename = `${name}-${uniqueSuffix}.${ext}`.toLocaleLowerCase();

    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, file.buffer);

    const picture = await models.picture.create({
      name,
      path: `/public/suggestions/${filename}`,
    });

    return response.status(201).json({ picture });
  } catch (error) {
    logger.error(error);
    return response.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred",
    });
  }
};
