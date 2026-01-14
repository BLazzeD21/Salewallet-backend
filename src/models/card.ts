import { DataTypes, Model, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

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

export default (sequelize: Sequelize) => {
  class Card extends Model<CardAttributes> implements CardAttributes {
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

  Card.init({
    card_id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    card_number: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    description: DataTypes.STRING(400),
    color: DataTypes.STRING(7),
    barcode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    barcode_type: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    qr_data: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    added_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'card',
    timestamps: false
  });

  return Card;
};
