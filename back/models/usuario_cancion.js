'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsuarioCancion extends Model {
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
    
      this.belongsTo(models.Cancion, {
        foreignKey: 'cancion_id'
      });
    }
  }
  UsuarioCancion.init({
    usuario_id: DataTypes.INTEGER,
    cancion_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UsuarioCancion',
    tableName: process.env.TABLA_USUARIO_CANCION
  });
  return UsuarioCancion;
};