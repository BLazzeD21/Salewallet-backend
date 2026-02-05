import { Model } from "sequelize";

export interface PictureAttributes {
  picture_id: string;
  name: string;
  path: string;
  created_at: Date;
}

export interface PictureCreationAttributes extends Omit<PictureAttributes, "picture_id" | "created_at"> {}

export class Picture extends Model<PictureAttributes, PictureCreationAttributes> implements PictureAttributes {
  declare picture_id: string;
  declare name: string;
  declare path: string;
  declare created_at: Date;
}
