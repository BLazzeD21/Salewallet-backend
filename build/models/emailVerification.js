import { DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
export default (sequelize) => {
    class EmailVerification extends Model {
    }
    EmailVerification.init({
        verification_id: {
            type: DataTypes.UUID,
            defaultValue: () => uuidv4(),
            primaryKey: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        confirmed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'email_verification',
        timestamps: false
    });
    return EmailVerification;
};
