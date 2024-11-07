'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Genero extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Cancion, {
        through: models.GeneroCancion,
        foreignKey: 'genero_id'
      });
    }
  }
  Genero.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Genero',
    tableName: process.env.TABLA_GENERO
  });
  return Genero;
};