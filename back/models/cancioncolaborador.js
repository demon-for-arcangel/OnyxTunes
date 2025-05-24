'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cancionColaborador extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  cancionColaborador.init({
    cancion_id: DataTypes.INTEGER,
    usuario_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'cancionColaborador',
    tableName: process.env.TABLA_CANCION_COLABORADOR
  });
  return cancionColaborador;
};