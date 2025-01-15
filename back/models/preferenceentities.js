'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PreferenceEntities extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Preferences, {
        foreignKey: 'preference_id',
      });
    }
  }
  PreferenceEntities.init({
    preference_id: DataTypes.INTEGER,
    entidad_id: DataTypes.INTEGER,
    entidad_tipo: DataTypes.ENUM('Artista', 'Genero')
  }, {
    sequelize,
    modelName: 'PreferenceEntities',
    tableName: process.env.TABLA_PREFERENCES_ENTIDADES
  });
  return PreferenceEntities;
};