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
    titulo: DataTypes.STRING,
    duracion: DataTypes.INTEGER,
    album_id: DataTypes.INTEGER,
    artistaId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cancion',
  });
  return Cancion;
};