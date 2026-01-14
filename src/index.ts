import dotenv from "dotenv";
import express from "express";
import db from "./config/db.js";

const main = async () => {
  dotenv.config();

  await db.connectDB();

  const app = express();
  app.use(express.json());

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

main();
