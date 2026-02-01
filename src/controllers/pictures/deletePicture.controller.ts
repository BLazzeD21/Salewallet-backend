import constants from "node:constants";
import { access, unlink } from "node:fs/promises";
import { join } from "node:path";

import type { Request, Response } from "express";

import models from "@/models";

/**
 * @openapi
 * /picture/delete:
 *   delete:
 *     tags:
 *       - Picture
 *     summary: Delete a picture
 *     description: Deletes images from the database and disk at the specified path
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/DeletePictureRequest"
 *     responses:
 *       200:
 *         description: Deletion completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DeletePictureResponse"
 *       400:
 *         description: Valid path is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NoPathProvided"
 *       404:
 *         description: Neither file nor database record exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NothingToDelete"
 *       500:
 *         description: Failed to delete file from storage
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                   - $ref: "#/components/schemas/FileDeletionFailed"
 *                   - $ref: "#/components/schemas/InternalServerError"
 */

export const deletePicture = async (req: Request, res: Response) => {
  try {
    const { path } = req.body;

    if (!path || typeof path !== "string") {
      return res.status(400).json({
        code: "NO_PATH_PROVIDED",
        message: "Valid path is required",
      });
    }

    const sanitizedPath = path.replace(/\.\./g, "").replace(/\/\//g, "/");
    const uploadDir = process.cwd();
    const filePath = join(uploadDir, sanitizedPath);

    const dbRecord = await models.picture.findOne({
      where: { path: sanitizedPath },
    });

    let fileExists = true;

    try {
      await access(filePath, constants.F_OK);
    } catch {
      fileExists = false;
    }

    if (!fileExists && !dbRecord) {
      return res.status(404).json({
        code: "NOTHING_TO_DELETE",
        message: "Neither file nor database record exists",
      });
    }

    if (fileExists) {
      try {
        await unlink(filePath);
      } catch {
        return res.status(500).json({
          code: "FILE_DELETION_FAILED",
          message: "Failed to delete file from storage",
        });
      }
    }

    if (dbRecord) {
      await dbRecord.destroy();
    }

    return res.status(200).json({
      message: "Deletion completed successfully",
      deletedFromDisk: fileExists,
      deletedFromDatabase: Boolean(dbRecord),
    });
  } catch {
    return res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred",
    });
  }
};
