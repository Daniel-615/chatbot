const { Model, DataTypes } = require('sequelize');

class User extends Model {}

module.exports = (sequelize) => {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
        },
        {
            sequelize,
            modelName: 'USER',
            tableName: 'USER',
            timestamps: true
        }
    );

    return User;
};