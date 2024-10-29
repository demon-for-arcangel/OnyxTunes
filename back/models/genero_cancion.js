'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GeneroCancion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Cancion, {
        foreignKey: 'cancion_id'
      });

      this.belongsTo(models.Genero, {
        foreignKey: 'genero_id'
      });
    }
  }
  GeneroCancion.init({
    cancion_id: DataTypes.INTEGER,
    genero_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'GeneroCancion',
    tableName: process.env.TABLA_GENERO_CANCION
  });
  return GeneroCancion;
};