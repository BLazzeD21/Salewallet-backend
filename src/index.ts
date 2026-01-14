import dotenv from "dotenv";
import express from "express";
import { connectDB, disconnectDB } from "./config/db.js";

import userRoutes from './routes/userRoutes.js';


const main = async () => {
  try {
    dotenv.config();

    await connectDB();

    const app = express();
    app.use(express.json());

    app.get('/', (req, res) => res.send('Server is running'));
    app.use('/api/v1', userRoutes);

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    const gracefulShutdown = async () => {
      console.log('\nShutting down server');
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);

  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
};

main();
