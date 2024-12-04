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
      this.belongsToMany(models.Usuario, {
        through: process.env.TABLA_USUARIO_PLAYLIST,
        foreignKey: 'playlist_id', 
        otherKey: 'usuario_id',   
      });

      this.hasMany(models.Like, { 
        foreignKey: 'entidad_id', 
        constraints: false, 
        scope: {
          entidad_tipo: 'Playlist' 
        }
      });
    
      this.belongsToMany(models.Cancion, {
        through: models.CancionPlaylist,
        foreignKey: 'playlist_id',
        as: 'canciones'
      });
    }
  }
  Playlist.init({
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Playlist',
    tableName: process.env.TABLA_PLAYLIST
  });
  return Playlist;
};