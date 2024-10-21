'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usuario_cancion extends Model {
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
    
      this.belongsTo(models.cancion, {
        foreignKey: 'cancion_id'
      });
    }
  }
  usuario_cancion.init({
    usuario_id: DataTypes.INTEGER,
    cancion_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'usuario_cancion',
    tableName: process.env.TABLA_USUARIO_CANCION
  });
  return usuario_cancion;
};