import { DataTypes, type Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { Card } from "../types/types.js";

export default (sequelize: Sequelize) => {
  Card.init(
    {
      card_id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      card_number: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      description: DataTypes.STRING(400),
      color: DataTypes.STRING(7),
      barcode: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      barcode_type: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      qr_data: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
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
