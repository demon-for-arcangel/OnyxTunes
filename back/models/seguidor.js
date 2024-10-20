'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Seguidor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Seguidor.init({
    seguidor_id: DataTypes.INTEGER,
    seguido_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Seguidor',
    tableName: process.env.TABLA_SEGUIDORES
  });
  return Seguidor;
};