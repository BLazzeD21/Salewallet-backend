import { logger } from "@/config";

const requiredEnvVars = [
  "PORT",
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "DB_PORT",
  "DOMAIN",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USERNAME",
  "SMTP_PASSWORD",
  "FROM_EMAIL_USERNAME",
  "AUTH_SECRET",
  "AUTH_SECRET_EXPIRES_IN",
  "AUTH_REFRESH_SECRET",
  "AUTH_REFRESH_SECRET_EXPIRES_IN",
];

export const checkEnvVariables = () => {
  const missingVars = requiredEnvVars.filter((key) => {
    return !process.env[key];
  });

  if (missingVars.length > 0) {
    logger.error("Missing required environment variables:", missingVars.join(", "));
    process.exit(1);
  }

  if (Number.isNaN(Number(process.env.PORT))) {
    logger.error("PORT must be a number");
    process.exit(1);
  }

  if (Number.isNaN(Number(process.env.DB_PORT))) {
    logger.error("DB_PORT must be a number");
    process.exit(1);
  }

  if (Number.isNaN(Number(process.env.SMTP_PORT))) {
    logger.error("SMTP_PORT must be a number");
    process.exit(1);
  }

  if (Number.isNaN(Number(process.env.AUTH_SECRET_EXPIRES_IN))) {
    logger.error("AUTH_SECRET_EXPIRES_IN must be a number");
    process.exit(1);
  }

  if (Number.isNaN(Number(process.env.AUTH_REFRESH_SECRET_EXPIRES_IN))) {
    logger.error("AUTH_REFRESH_SECRET_EXPIRES_IN must be a number");
    process.exit(1);
  }

  try {
    new URL(process.env.DOMAIN);
  } catch {
    logger.error("DOMAIN must be a valid URL");
    process.exit(1);
  }

  logger.info("All environment variables have been checked");
};
