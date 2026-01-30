import { Router } from "express";

import { upload } from "@/config";

import { uploadPicture } from "@/controllers";

import { verifyAuth } from "@/middlewares";

const router = Router();

router.post("/picture/upload", verifyAuth, upload.single("file"), uploadPicture);

export { router as pictureRoutes };
