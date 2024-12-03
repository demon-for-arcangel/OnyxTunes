'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Asset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Mensaje, {
        foreignKey: 'asset_id',
        as: 'mensaje', 
      });
    }
  }
  Asset.init({
    asset_type: DataTypes.STRING,
    asset_id: DataTypes.INTEGER,
    file_link: DataTypes.STRING,
    file_type: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Asset',
    tableName: process.env.TABLA_ASSET
  });
  return Asset;
};