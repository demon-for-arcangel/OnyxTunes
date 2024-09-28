'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cancion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Cancion.init({
    id_album: DataTypes.INTEGER,
    id_artista: DataTypes.INTEGER,
    titulo: DataTypes.STRING,
    duracion: DataTypes.TIME,
    archivo_audio: DataTypes.STRING,
    reproducciones: DataTypes.INTEGER,
    fecha_subida: DataTypes.DATE,
    genero: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Cancion',
  });
  return Cancion;
};