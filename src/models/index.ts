import type { ModelStatic, Sequelize } from "sequelize";

import { logger, sequelize } from "@/config";

import type { Card, EmailVerification, Picture, User } from "@/types";

import cardModel from "./card.model";
import emailVerificationModel from "./emailVerification.model";
import picturesModel from "./picture.model";
import userModel from "./user.model";

interface DbModels {
  sequelize: Sequelize;
  user: ModelStatic<User>;
  card: ModelStatic<Card>;
  email_verification: ModelStatic<EmailVerification>;
  picture: ModelStatic<Picture>;
}

const models: DbModels = {
  sequelize,
  user: userModel(sequelize),
  card: cardModel(sequelize),
  picture: picturesModel(sequelize),
  email_verification: emailVerificationModel(sequelize),
};

models.user.hasMany(models.card, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
models.card.belongsTo(models.user, {
  foreignKey: "user_id",
});

models.user.hasMany(models.email_verification, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
models.email_verification.belongsTo(models.user, { foreignKey: "user_id" });

sequelize
  .query(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`)
  .then(() => {
    logger.info("pg_trgm extension checked/created");
    return sequelize.query(`
      CREATE INDEX IF NOT EXISTS pictures_name_trgm_idx
      ON pictures
      USING GIN (name gin_trgm_ops);
    `);
  })
  .then(() => {
    logger.info("GIN trigram index for pictures.name ensured");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    logger.info("All models were synchronized with the database");
  })
  .catch((error) => {
    logger.error("Error during database setup:", error);
  });

models.sequelize = sequelize;

export * from "./card.model";
export * from "./emailVerification.model";
export * from "./picture.model";
export * from "./user.model";

export default models;
