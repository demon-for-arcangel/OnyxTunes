'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Playlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id'
      });
    
      this.belongsToMany(models.Cancion, {
        through: models.CancionPlaylist,
        foreignKey: 'playlist_id',
      });
    }
  }
  Playlist.init({
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    likes: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Playlist',
    tableName: process.env.TABLA_PLAYLIST
  });
  return Playlist;
};