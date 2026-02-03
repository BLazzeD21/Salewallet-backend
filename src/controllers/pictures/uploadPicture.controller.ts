import fs from "node:fs";
import path, { join } from "node:path";

import type { Request, Response } from "express";

import models from "@/models";

/**
 * @openapi
 * /picture/upload:
 *   post:
 *     tags:
 *       - Picture
 *     summary: Upload a picture
 *     description: Uploads a PNG or JPEG image to the server with a unique name
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "#/components/schemas/UploadPictureRequest"
 *     responses:
 *       201:
 *         description: Picture uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UploadPictureResponse"
 *       400:
 *         description: Invalid input or file
 *         content:
 *           application/json:ы
 *             schema:
 *               oneOf:
 *                 - $ref: "#/components/schemas/NoFileProvidedError"
 *                 - $ref: "#/components/schemas/InvalidNameInputError"
 *                 - $ref: "#/components/schemas/InvalidFileTypeError"
 *                 - $ref: "#/components/schemas/FileTooLargeError"
 *       409:
 *         description: Duplicate picture name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DuplicateNameError"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/InternalServerError"
 */

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
  } catch {
    return response.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred",
    });
  }
};
