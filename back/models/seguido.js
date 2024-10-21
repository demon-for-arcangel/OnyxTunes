'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class seguido extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  seguido.init({
    usuario_id: DataTypes.INTEGER,
    seguido_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'seguido',
    tableName: process.env.TABLA_SEGUIDOS
  });
  return seguido;
};