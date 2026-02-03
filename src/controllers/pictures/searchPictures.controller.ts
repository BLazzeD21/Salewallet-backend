import type { Request, Response } from "express";
import { literal } from "sequelize";

import { logger } from "@/config";

import models from "@/models";

/**
 * @openapi
 * /picture/search:
 *   get:
 *     tags:
 *       - Picture
 *     summary: Search for an image by name
 *     description: Searches for images by name using fuzzy search
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PictureName'
 *     responses:
 *       200:
 *         description: Pictures found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SearchPicturesResponse"
 *       400:
 *         description: Name query parameter is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/InvalidQueryNameInputError"
 *       404:
 *         description: No images were found for the given queue
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PIcturesNotFoundError"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *                $ref: "#/components/schemas/InternalServerError"
 */

export const searchPictures = async (request: Request, response: Response) => {
  try {
    const { name } = request.query as { name: string };

    if (!name) {
      return response.status(400).json({
        code: "INVALID_NAME_INPUT",
        message: "name query parameter is required",
      });
    }

    const pictures = await models.picture.findAll({
      attributes: ["name", "path", [literal(`similarity(name, '${name}')`), "score"]],
      where: literal(`similarity(name, '${name}') > 0.3`),
      order: [[literal("score"), "DESC"]],
      limit: 20,
    });

    if (!pictures.length) {
      return response.status(404).json({
        code: "PICTURES_NOT_FOUND",
        message: "No images were found for the given queue",
      });
    }

    return response.json({ pictures });
  } catch (error) {
    logger.error(error);
    return response.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred",
    });
  }
};
