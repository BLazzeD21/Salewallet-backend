import fs from "node:fs";
import path from "node:path";

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
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: "#/components/schemas/NoFileProvided"
 *                 - $ref: "#/components/schemas/InvalidNameInput"
 *                 - $ref: "#/components/schemas/InvalidFileType"
 *                 - $ref: "#/components/schemas/FileTooLarge"
 *       409:
 *         description: Duplicate picture name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DuplicateName"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/InternalServerError"
 */

export const uploadPicture = async (req: Request, res: Response) => {
  try {
    const uploadDir = path.join(process.cwd(), "public", "suggestions");

    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const file = req.file;

    if (!file) {
      return res.status(400).json({ code: "NO_FILE_PROVIDED", message: "File is required" });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ code: "INVALID_INPUT", message: "Name is required" });
    }

    if (!["image/png", "image/jpeg"].includes(file.mimetype)) {
      return res.status(400).json({
        code: "INVALID_FILE_TYPE",
        message: "Only PNG and JPEG allowed",
      });
    }

    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ code: "FILE_TOO_LARGE", message: "File must be <= 5MB" });
    }

    const existing = await models.picture.findOne({ where: { name } });

    if (existing) {
      return res.status(409).json({
        code: "DUPLICATE_NAME",
        message: "A picture with this name already exists",
      });
    }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = file.originalname.split(".").pop();

    const filename = `${name}-${uniqueSuffix}.${ext}`;

    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, file.buffer);

    const picture = await models.picture.create({
      name,
      path: `/public/suggestions/${filename}`,
    });

    return res.status(201).json({ picture });
  } catch {
    return res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred",
    });
  }
};
