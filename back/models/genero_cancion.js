'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class genero_cancion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  genero_cancion.init({
    cancion_id: DataTypes.NUMBER,
    genero_id: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'genero_cancion',
  });
  return genero_cancion;
};