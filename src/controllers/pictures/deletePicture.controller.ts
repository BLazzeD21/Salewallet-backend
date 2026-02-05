import constants from "node:constants";
import { access, unlink } from "node:fs/promises";
import { join } from "node:path";

import type { Request, Response } from "express";

import { logger } from "@/config";

import models from "@/models";

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
  } catch (error) {
    logger.error(error);
    return response.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred",
    });
  }
};
