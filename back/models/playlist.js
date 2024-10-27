'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class playlist extends Model {
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
    
      this.belongsToMany(models.cancion, {
        through: models.cancion_playlist,
        foreignKey: 'playlist_id'
      });
    }
  }
  playlist.init({
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'playlist',
    tableName: process.env.TABLA_PLAYLIST
  });
  return playlist;
};