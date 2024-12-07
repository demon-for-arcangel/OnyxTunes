'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Historial extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });

      this.belongsTo(models.Cancion, {
        foreignKey: 'cancion_id',
        as: 'cancion'
      });
    }
  }
  Historial.init({
    usuario_id: DataTypes.INTEGER,
    cancion_id: DataTypes.INTEGER,
    fecha_reproduccion: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Historial',
    tableName: process.env.TABLA_HISTORIAL
  });
  return Historial;
};