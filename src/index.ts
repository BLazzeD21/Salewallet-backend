import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import express from "express";
import swaggerUi from "swagger-ui-express";

import { connectDB, disconnectDB } from "@/config";

import { authRoutes, cardRoutes, pictureRoutes } from "@/routes";

import swaggerDocs from "./swagger";
import { checkEnvVariables } from "./utils";

dotenv.config();

checkEnvVariables();

const PORT = process.env.PORT || 5500;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.resolve(__dirname, "../public");

const main = async () => {
  try {
    const uploadDir = path.join(process.cwd(), "public", "suggestions");

    if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

    await connectDB();

    const app = express();
    app.use(express.json());

    app.get("/", (_req, res) => res.send("Server is running"));
    app.use("/api/v1", authRoutes);
    app.use("/api/v1", cardRoutes);
    app.use("/api/v1", pictureRoutes);

    app.use("/public", express.static(publicPath));

    app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, { customSiteTitle: "SaleWallet Docs" }));

    const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    const gracefulShutdown = async () => {
      console.log("\nShutting down server");
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
};

main();
