const { Model, DataTypes } = require('sequelize');

class Message extends Model {}

module.exports = (sequelize) => {

    Message.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            chat_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            message: {
                type: DataTypes.TEXT,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'MESSAGE',
            tableName: 'MESSAGE',
            timestamps: true
        }
    );

    return Message;
};