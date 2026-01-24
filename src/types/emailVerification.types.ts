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
