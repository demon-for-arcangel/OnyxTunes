'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Album.init({
    id_artista: DataTypes.INTEGER,
    titulo: DataTypes.STRING,
    fecha_lanzamiento: DataTypes.DATE,
    imagen: DataTypes.STRING,
    genero: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Album',
  });
  return Album;
};