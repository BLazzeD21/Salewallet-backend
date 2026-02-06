import { literal } from "sequelize";

import models from "@/models";

import type { FoundPicture, SearchPicturesRequest, SearchPicturesResponse } from "@/types";

import { InvalidNameInputError } from "@/errors/picture.error";

export const searchPictures = async (request: SearchPicturesRequest): Promise<SearchPicturesResponse> => {
  const { name } = request;

  if (!name) {
    throw new InvalidNameInputError();
  }

  const pictures = await models.picture.findAll({
    attributes: ["name", "path", [literal(`similarity(name, '${name}')`), "score"]],
    where: literal(`similarity(name, '${name}') > 0.3`),
    order: [[literal("score"), "DESC"]],
    limit: 20,
    raw: true,
  });

  const mappedPictures: FoundPicture[] = pictures.map((picture) => ({
    name: picture.name,
    path: picture.path,
    score: Number(picture.score),
  }));

  return { pictures: mappedPictures };
};
