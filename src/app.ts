import path from "node:path";
import { fileURLToPath } from "node:url";

import compression from "compression";
import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import { loggerMiddleware } from "@/middlewares";

import { authRoutes, cardRoutes, pictureRoutes } from "@/routes";

import swaggerDocs from "./swagger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.resolve(__dirname, "../public");

export const createApp = () => {
  const app = express();

  app.set("trust proxy", true);

  app.use(express.json());
  app.use(compression());
  app.use(helmet());
  app.use(loggerMiddleware);

  app.get("/", (_req, res) => res.send("Server is running"));

  app.use("/api/v1", authRoutes);
  app.use("/api/v1", cardRoutes);
  app.use("/api/v1", pictureRoutes);

  app.use(
    "/api/v1/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, {
      customSiteTitle: "SaleWallet Docs",
    }),
  );

  app.use("/public", express.static(publicPath));

  return app;
};
