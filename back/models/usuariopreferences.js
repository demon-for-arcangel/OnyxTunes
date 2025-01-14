'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsuarioPreferences extends Model {
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

      this.belongsTo(models.Preferences, { 
        foreignKey: 'preference_id' 
      });
    }
  }
  UsuarioPreferences.init({
    usuario_id: DataTypes.INTEGER,
    preference_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UsuarioPreferences',
    tableName: process.env.TABLA_USUARIO_PREFERENCES
  });
  return UsuarioPreferences;
};