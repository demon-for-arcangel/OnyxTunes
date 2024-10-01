'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lista extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Lista.init({
    id_usuario: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    fecha_creacion: DataTypes.DATE,
    imagen: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Lista',
  });
  return Lista;
};