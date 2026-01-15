import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import YAML from "yamljs";

import { connectDB, disconnectDB } from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";

import swaggerUi from "swagger-ui-express";

const swaggerDocument = YAML.load("./swagger.yaml");

dotenv.config();

const PORT = process.env.PORT || 5000;
const DOMAIN = process.env.DOMAIN;

const allowedOrigin =
  process.env.NODE_ENV === "production" ? DOMAIN : `http://localhost:${PORT}`;

const corsOptions = {
  origin: allowedOrigin,
  optionsSuccessStatus: 200,
  credentials: true,
};

const main = async () => {
  try {
    await connectDB();

    const app = express();
    app.use(express.json());
    app.use(cors(corsOptions));

    app.get("/", (req, res) => res.send("Server is running"));
    app.use("/api/v1", userRoutes);

    app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    const server = app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`),
    );

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
