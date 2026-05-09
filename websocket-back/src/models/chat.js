const { Model, DataTypes } = require('sequelize');

class Chat extends Model {}

module.exports = (sequelize) => {
    Chat.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            user_id: {
                type: DataTypes.INTEGER, 
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'CHAT',
            tableName: 'CHAT',
            timestamps: true
        }
    );

    return Chat;
};