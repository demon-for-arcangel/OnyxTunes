'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RolUsuario extends Model {
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

      this.belongsTo(models.Rol, {
        foreignKey: 'rol_id'
      })
    }
  }
  RolUsuario.init({
    usuario_id: DataTypes.INTEGER,
    rol_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RolUsuario',
    tableName: process.env.TABLA_ROL_USUARIO
  });
  return RolUsuario;
};