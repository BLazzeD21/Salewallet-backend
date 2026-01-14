import db from '../config/db.js';
import cardModel from './card.js';
import emailVerificationModel from './emailVerification.js';
import userModel from './user.js';
const models = {};
models.user = userModel(db.sequelize);
models.card = cardModel(db.sequelize);
models.email_verification = emailVerificationModel(db.sequelize);
models.user.hasMany(models.card, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
models.card.belongsTo(models.user, { foreignKey: 'user_id' });
models.user.hasMany(models.email_verification, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
models.email_verification.belongsTo(models.user, { foreignKey: 'user_id' });
db.sequelize.sync({ alter: true })
    .then(() => console.log('All models were synchronized'))
    .catch(error => console.error('Error syncing models:', error));
export default models;
