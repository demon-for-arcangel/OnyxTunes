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
        through: 'playlist_cancion',
        foreignKey: 'playlist_id'
      });
    }
  }
  Playlist.init({
    usuario_id: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Playlist',
    tableName: process.env.TABLA_PLAYLIST
  });
  return Playlist;
};