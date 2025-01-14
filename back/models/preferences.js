'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Preferences extends Model {
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
    }
  }
  Preferences.init({
    usuario_id: DataTypes.INTEGER,
    entidad_id: DataTypes.INTEGER,
    entidad_tipo: DataTypes.ENUM('Artista', 'Genero')
  }, {
    sequelize,
    modelName: 'Preferences',
    tableName: process.env.TABLA_PREFERENCES
  });
  return Preferences;
};