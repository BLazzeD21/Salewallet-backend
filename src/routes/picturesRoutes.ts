import { Router } from "express";

import { upload } from "@/config";

import { deletePicture, searchPictures, uploadPicture } from "@/controllers";

import { verifyAuth } from "@/middlewares";

const router = Router();

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

router.post("/picture/upload", verifyAuth, upload.single("file"), uploadPicture);

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

router.delete("/picture/delete", verifyAuth, deletePicture);

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

router.get("/picture/search", searchPictures);

export { router as pictureRoutes };
