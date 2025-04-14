'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recomendacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Recomendacion.init({
    usuario_id: DataTypes.INTEGER,
    cancion_id: DataTypes.INTEGER,
    fecha_recomendacion: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Recomendacion',
    tableName: process.env.TABLA_RECOMENDACIONES
  });
  return Recomendacion;
};