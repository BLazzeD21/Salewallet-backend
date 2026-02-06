import constants from "node:constants";
import { access, unlink } from "node:fs/promises";
import { join } from "node:path";

import models from "@/models";

import type { DeletePictureRequest, DeletePictureResponse } from "@/types";

import { FileDeletionFailedError, NoPathProvidedError, NothingToDeleteError } from "@/errors";

export const deletePicture = async (request: DeletePictureRequest): Promise<DeletePictureResponse> => {
  let { path } = request;

  if (!path || typeof path !== "string") {
    throw new NoPathProvidedError();
  }

  path = path.toLowerCase();

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
    throw new NothingToDeleteError();
  }

  if (fileExists) {
    try {
      await unlink(filePath);
    } catch {
      throw new FileDeletionFailedError();
    }
  }

  if (dbRecord) {
    await dbRecord.destroy();
  }

  return {
    deletedFromDisk: fileExists,
    deletedFromDatabase: Boolean(dbRecord),
  };
};
