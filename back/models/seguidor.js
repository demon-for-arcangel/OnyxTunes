'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class seguidor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  seguidor.init({
    seguidor_id: DataTypes.INTEGER,
    seguido_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'seguidor',
    tableName: process.env.TABLA_SEGUIDORES
  });
  return seguidor;
};