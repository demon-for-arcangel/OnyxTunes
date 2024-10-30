'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReaccionComentario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
    }
  }
  ReaccionComentario.init({
    usuario_id: DataTypes.INTEGER,
    cancion_id: DataTypes.INTEGER,
    comentario: DataTypes.STRING,
    reaccion: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ReaccionComentario',
    tableName: process.env.TABLA_COMENTARIO_REACCION
  });
  return ReaccionComentario;
};