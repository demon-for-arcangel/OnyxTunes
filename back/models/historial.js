'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class historial extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  historial.init({
    usuario_id: DataTypes.INTEGER,
    cancion_id: DataTypes.INTEGER,
    fecha_reproduccion: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'historial',
    tableName: process.env.TABLA_HISTORIAL
  });
  return historial;
};