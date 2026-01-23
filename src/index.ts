import dotenv from "dotenv";
import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { connectDB, disconnectDB } from "./config/db.js";
import AuthRoutes from "./routes/authRoutes.js";
import UserRoutes from "./routes/userRoutes.js";

const swaggerDocument = YAML.load("./swagger.yaml");

dotenv.config();

const PORT = process.env.PORT || 5500;

const main = async () => {
  try {
    await connectDB();

    const app = express();
    app.use(express.json());

    app.get("/", (_req, res) => res.send("Server is running"));
    app.use("/api/v1", UserRoutes);
    app.use("/api/v1", AuthRoutes);

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
