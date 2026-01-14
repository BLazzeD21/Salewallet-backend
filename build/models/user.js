import { DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
export default (sequelize) => {
    class User extends Model {
    }
    User.init({
        user_id: {
            type: DataTypes.UUID,
            defaultValue: () => uuidv4(),
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        mail: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'user',
        timestamps: false
    });
    return User;
};
