'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usuario_cancion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  usuario_cancion.init({
    usuario_id: DataTypes.INTEGER,
    cancion_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'usuario_cancion',
  });
  return usuario_cancion;
};