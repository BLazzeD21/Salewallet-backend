import { DataTypes, type Sequelize } from "sequelize";

import { Picture } from "@/types";

export default (sequelize: Sequelize) => {
  Picture.init(
    {
      picture_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true,
        validate: {
          isUUID: 4,
        },
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          len: {
            args: [1, 100],
            msg: "Name must be between 1 and 100 characters",
          },
        },
      },
      path: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: {
            args: [1, 255],
            msg: "Path must be between 1 and 255 characters",
          },
        },
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "picture",
      tableName: "pictures",
      timestamps: false,
    },
  );

  return Picture;
};
