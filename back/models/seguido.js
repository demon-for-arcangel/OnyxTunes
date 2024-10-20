'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Seguido extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Seguido.init({
    usuario_id: DataTypes.INTEGER,
    seguido_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Seguido',
  });
  return Seguido;
};