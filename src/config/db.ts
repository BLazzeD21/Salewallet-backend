import { Sequelize } from "sequelize";

import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
    logging: false,
  },
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected");
  } catch (error) {
    console.error("Unable to connect to PostgreSQL:", error);
    process.exit(1);
  }
};

const disconnectDB = async (): Promise<void> => {
  try {
    await sequelize.close();
    console.log("PostgreSQL disconnected");
  } catch (error) {
    console.error("Error disconnecting PostgreSQL:", error);
  }
};

export { connectDB, disconnectDB, sequelize };
