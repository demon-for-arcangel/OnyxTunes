'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Artista extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Artista.init({
    nombre: DataTypes.STRING,
    biografia: DataTypes.TEXT,
    imagen: DataTypes.STRING,
    pais: DataTypes.STRING,
    fecha_creacion: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Artista',
  });
  return Artista;
};