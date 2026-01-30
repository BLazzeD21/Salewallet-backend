import type { ModelStatic, Sequelize } from "sequelize";

import { sequelize } from "@/config";

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
  .sync({ alter: true })
  .then(() => console.log("All models were synchronized"))
  .catch((error) => console.error("Error syncing models:", error));

models.sequelize = sequelize;

export * from "./card.model";
export * from "./emailVerification.model";

export default models;
