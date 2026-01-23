import dotenv from "dotenv";
import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import { connectDB, disconnectDB } from "@/config";

import { authRoutes, cardRoutes } from "@/routes";

const swaggerDocument = YAML.load("./swagger.yaml");

dotenv.config();

const PORT = process.env.PORT || 5500;

const main = async () => {
  try {
    await connectDB();

    const app = express();
    app.use(express.json());

    app.get("/", (_req, res) => res.send("Server is running"));
    app.use("/api/v1", authRoutes);
    app.use("/api/v1", cardRoutes);

    app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
