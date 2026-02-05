import { Model } from "sequelize";

import type { Card } from "./card.types";

export interface UserAttributes {
  user_id: string;
  username: string;
  mail: string;
  password: string;
  confirmed: boolean;
  created_at: Date;
}

export interface UserCreationAttributes extends Omit<UserAttributes, "created_at" | "verification_id" | "confirmed"> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare user_id: string;
  declare username: string;
  declare mail: string;
  declare password: string;
  declare confirmed: boolean;
  declare created_at: Date;
}

export type UserWithCards = User & {
  cards: Card[];
};
