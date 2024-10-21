'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class genero_cancion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.cancion, {
        foreignKey: 'cancion_id'
      });

      this.belongsTo(models.genero, {
        foreignKey: 'genero_id'
      });
    }
  }
  genero_cancion.init({
    cancion_id: DataTypes.INTEGER,
    genero_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'genero_cancion',
    tableName: process.env.TABLA_GENERO_CANCION
  });
  return genero_cancion;
};