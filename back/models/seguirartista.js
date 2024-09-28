'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SeguirArtista extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SeguirArtista.init({
    id_usuario: DataTypes.INTEGER,
    id_artista: DataTypes.INTEGER,
    fecha_seguimiento: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'SeguirArtista',
  });
  return SeguirArtista;
};