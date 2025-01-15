'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reproducciones extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
      });

      this.belongsTo(models.Cancion, {
        foreignKey: 'entidad_id',
      });

      this.belongsTo(models.Playlist, {
        foreignKey: 'entidad_id',
      });
      
      this.belongsTo(models.Album, {
        foreignKey: 'entidad_id',
      });
    }
  }
  Reproducciones.init({
    usuario_id: DataTypes.INTEGER,
    entidad_id: DataTypes.INTEGER,
    entidad_tipo: DataTypes.ENUM('Cancion', 'Playlist', 'Album'),
    reproducciones: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reproducciones',
    tableName: process.env.TABLA_REPRODUCCIONES
  });
  return Reproducciones;
};