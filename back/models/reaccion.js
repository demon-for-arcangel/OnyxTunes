'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reaccion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Reaccion.init({
    id_usuario: DataTypes.INTEGER,
    id_cancion: DataTypes.INTEGER,
    tipo_reaccion: DataTypes.STRING,
    fecha_reaccion: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Reaccion',
  });
  return Reaccion;
};