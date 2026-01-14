import { DataTypes, Model, Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export interface EmailVerificationAttributes {
  verification_id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  confirmed?: boolean;
  created_at?: Date;
}

export default (sequelize: Sequelize) => {
  class EmailVerification
    extends Model<EmailVerificationAttributes>
    implements EmailVerificationAttributes
  {
    declare verification_id: string;
    declare user_id: string;
    declare token: string;
    declare expires_at: Date;
    declare confirmed: boolean;
    declare created_at: Date;
  }

  EmailVerification.init(
    {
      verification_id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      confirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "email_verification",
      timestamps: false,
    },
  );

  return EmailVerification;
};
