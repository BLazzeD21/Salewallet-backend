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
 *               $ref: "#/components/schemas/NoPathProvidedError"
 *       404:
 *         description: Neither file nor database record exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NothingToDeleteError"
 *       500:
 *         description: Failed to delete file from storage
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                   - $ref: "#/components/schemas/FileDeletionFailedError"
 *                   - $ref: "#/components/schemas/InternalServerError"
 */

export const deletePicture = async (request: Request, response: Response) => {
  try {
    let { path } = request.body as {
      path: string;
    };

    path = path.toLocaleLowerCase();

    if (!path || typeof path !== "string") {
      return response.status(400).json({
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
      return response.status(404).json({
        code: "NOTHING_TO_DELETE",
        message: "Neither file nor database record exists",
      });
    }

    if (fileExists) {
      try {
        await unlink(filePath);
      } catch {
        return response.status(500).json({
          code: "FILE_DELETION_FAILED",
          message: "Failed to delete file from storage",
        });
      }
    }

    if (dbRecord) {
      await dbRecord.destroy();
    }

    return response.status(200).json({
      message: "Deletion completed successfully",
      deletedFromDisk: fileExists,
      deletedFromDatabase: Boolean(dbRecord),
    });
  } catch {
    return response.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred",
    });
  }
};
