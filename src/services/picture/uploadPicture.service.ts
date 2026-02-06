import fs from "node:fs";
import path, { join } from "node:path";

import models from "@/models";

import type { UploadPictureRequest, UploadPictureResponse } from "@/types";

import {
  DuplicatePictureNameError,
  FileTooLargeError,
  InvalidFileTypeError,
  InvalidPictureNameError,
  NoFileProvidedError,
} from "@/errors";

export const uploadPicture = async (request: UploadPictureRequest): Promise<UploadPictureResponse> => {
  const uploadDir = join(process.cwd(), "public", "suggestions");

  const { file, name } = request;

  if (!file) {
    throw new NoFileProvidedError();
  }

  if (!name) {
    throw new InvalidPictureNameError();
  }

  if (!["image/png", "image/jpeg"].includes(file.mimetype)) {
    throw new InvalidFileTypeError();
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new FileTooLargeError();
  }

  const existingFile = await models.picture.findOne({ where: { name } });

  if (existingFile) {
    throw new DuplicatePictureNameError();
  }

  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const ext = file.originalname.split(".").pop();

  const filename = `${name}-${uniqueSuffix}.${ext}`.toLowerCase();
  const filePath = path.join(uploadDir, filename);

  fs.writeFileSync(filePath, file.buffer);

  const picture = await models.picture.create({
    name,
    path: `/public/suggestions/${filename}`,
  });

  return {
    picture: {
      picture_id: picture.picture_id,
      createdAt: picture.created_at,
      name: picture.name,
      path: picture.path,
    },
  };
};
