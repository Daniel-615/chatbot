const { Model, DataTypes } = require('sequelize');

class N8N extends Model {
}

module.exports = (sequelize) => {
  N8N.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      response: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'N8N',
      tableName: 'N8N',
      timestamps: true
    }
  );

  return N8N;
};