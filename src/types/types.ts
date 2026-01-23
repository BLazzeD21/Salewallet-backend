import { Model } from "sequelize";

export interface EmailVerificationAttributes {
  verification_id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  confirmed: boolean;
  created_at: Date;
}

export interface EmailVerificationCreationAttributes
  extends Omit<EmailVerificationAttributes, "created_at" | "verification_id" | "confirmed"> {}

export class EmailVerification
  extends Model<EmailVerificationAttributes, EmailVerificationCreationAttributes>
  implements EmailVerificationAttributes
{
  declare verification_id: string;
  declare user_id: string;
  declare token: string;
  declare expires_at: Date;
  declare confirmed: boolean;
  declare created_at: Date;
}

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

export interface CardAttributes {
  card_id: string;
  user_id: string;
  card_number: string;
  name: string;
  description?: string;
  color?: string;
  barcode: string;
  barcode_type: string;
  qr_data: string;
  added_at: Date;
}

export interface CardCreationAttributes extends Omit<CardAttributes, "card_id" | "added_at"> {}

export class Card extends Model<CardAttributes, CardCreationAttributes> implements CardAttributes {
  declare card_id: string;
  declare user_id: string;
  declare card_number: string;
  declare name: string;
  declare description?: string;
  declare color?: string;
  declare barcode: string;
  declare barcode_type: string;
  declare qr_data: string;
  declare added_at: Date;
}

export interface ErrorResponse {
  code: string;
  message: string;
}
