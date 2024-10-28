'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reaccion_comentario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id'
      });

      this.belongsTo(models.cancion, {
        foreignKey: 'cancion_id'
      });
    }
  }
  reaccion_comentario.init({
    usuario_id: DataTypes.INTEGER,
    cancion_id: DataTypes.INTEGER,
    comentario: DataTypes.STRING,
    reaccion: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'reaccion_comentario',
    tableName: process.env.TABLA_COMENTARIO_REACCION
  });
  return reaccion_comentario;
};