'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comentario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Comentario.init({
    id_usuario: DataTypes.INTEGER,
    id_cancion: DataTypes.INTEGER,
    contenido: DataTypes.TEXT,
    fecha_comentario: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Comentario',
  });
  return Comentario;
};