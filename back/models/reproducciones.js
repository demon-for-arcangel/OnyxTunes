'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reproducciones extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Reproducciones.init({
    usuario_id: DataTypes.INTEGER,
    cancion_id: DataTypes.INTEGER,
    playlist_id: DataTypes.INTEGER,
    album_id: DataTypes.INTEGER,
    fecha: DataTypes.DATE,
    duracion: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'reproducciones',
    tableName:  process.env.TABLA_REPRODUCCIONES,
  });
  return Reproducciones;
};