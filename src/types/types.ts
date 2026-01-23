import { Model } from "sequelize";

export interface EmailVerificationAttributes {
  verification_id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  confirmed?: boolean;
  created_at?: Date;
}

export class EmailVerification extends Model<EmailVerificationAttributes> implements EmailVerificationAttributes {
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
  created_at?: Date;
}

export class User extends Model<UserAttributes> implements UserAttributes {
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
  added_at?: Date;
}

export class Card extends Model<CardAttributes> implements CardAttributes {
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
