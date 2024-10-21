'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class genero extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.cancion, {
        through: models.genero_cancion,
        foreignKey: 'genero_id'
      });
    }
  }
  genero.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'genero',
    tableName: process.env.TABLA_GENERO
  });
  return genero;
};