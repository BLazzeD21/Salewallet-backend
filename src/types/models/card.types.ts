import { Model } from "sequelize";

export type BarcodeType = "EAN_13" | "CODE_128" | "QR";

export interface CardAttributes {
  card_id: string;
  user_id: string;
  card_number: string;
  name: string;
  description?: string;
  color?: string;
  barcode: string;
  barcode_type: BarcodeType;
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
  declare barcode_type: BarcodeType;
  declare qr_data: string;
  declare added_at: Date;
}
