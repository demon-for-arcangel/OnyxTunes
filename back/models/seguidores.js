'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class seguidores extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  seguidores.init({
    user_id: DataTypes.INTEGER,
    seguidor_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'seguidores',
  });
  return seguidores;
};