'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class rol_usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.usuario, {
        foreignKey: 'usuario_id'
      });

      this.belongsTo(models.rol, {
        foreignKey: 'rol_id'
      })
    }
  }
  rol_usuario.init({
    usuario_id: DataTypes.INTEGER,
    rol_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'rol_usuario',
    tableName: process.env.TABLA_ROL_USUARIO
  });
  return rol_usuario;
};