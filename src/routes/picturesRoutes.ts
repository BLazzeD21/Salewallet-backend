import { Router } from "express";

import { upload } from "@/config";

import { deletePicture, uploadPicture } from "@/controllers";

import { verifyAuth } from "@/middlewares";

const router = Router();

router.post("/picture/upload", verifyAuth, upload.single("file"), uploadPicture);
router.delete("/picture/delete", verifyAuth, deletePicture);

export { router as pictureRoutes };
