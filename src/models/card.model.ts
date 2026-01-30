import { DataTypes, type Sequelize } from "sequelize";

import { Card } from "@/types";

export default (sequelize: Sequelize) => {
  Card.init(
    {
      card_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true,
        validate: {
          isUUID: { args: 4, msg: "card_id must be a valid UUID v4" },
        },
      },

      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          isUUID: { args: 4, msg: "user_id must be a valid UUID v4" },
        },
      },

      card_number: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          len: { args: [4, 100], msg: "card_number length must be between 4 and 100 characters" },
        },
      },

      name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
          len: { args: [1, 30], msg: "name length must be between 1 and 30 characters" },
        },
      },

      description: {
        type: DataTypes.STRING(400),
        allowNull: true,
        validate: {
          len: { args: [0, 400], msg: "description cannot exceed 400 characters" },
        },
      },

      color: {
        type: DataTypes.STRING(7),
        allowNull: true,
        validate: {
          is: { args: /^#([0-9A-Fa-f]{6})$/, msg: "color must be a valid hex code like #FFAA00" },
        },
      },

      barcode: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          len: { args: [3, 255], msg: "barcode length must be between 3 and 255 characters" },
        },
      },

      barcode_type: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          isIn: { args: [["EAN_13", "CODE_128", "QR"]], msg: "barcode_type must be one of: EAN_13, CODE_128, QR" },
        },
      },

      qr_data: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        validate: {
          len: { args: [1, 2000], msg: "qr_data cannot be empty and must not exceed 2000 characters" },
        },
      },

      added_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "card",
      timestamps: false,
    },
  );

  return Card;
};
