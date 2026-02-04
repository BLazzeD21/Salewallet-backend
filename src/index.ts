import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

import dotenv from "dotenv";

import { connectDB, disconnectDB, logger } from "@/config";

import { checkEnvVariables } from "@/utils";

import { createApp } from "./app";

dotenv.config();
checkEnvVariables();

const PORT = process.env.PORT || 5500;

const main = async () => {
  try {
    const uploadDir = join(process.cwd(), "public", "suggestions");
    if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

    await connectDB();

    const app = createApp();

    const server = app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

    const gracefulShutdown = async () => {
      logger.info("Shutting down server");
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
  } catch (error) {
    logger.error("Server failed to start:", error);
    process.exit(1);
  }
};

main();
