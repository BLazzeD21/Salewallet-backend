import dotenv from "dotenv";
import express from "express";
import { connectDB, sequelize } from "./config/db.js";

const main = async () => {
  dotenv.config();

  await connectDB();

  await sequelize.sync({ alter: true });
  console.log('All tables created/updated successfully');

  const app = express();
  app.use(express.json());

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

main();
