'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsuarioPlaylist extends Model {
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

      this.belongsTo(models.Playlist, {
        foreignKey: 'playlist_id',
      })
    }
  }
  UsuarioPlaylist.init({
    usuario_id: DataTypes.INTEGER,
    playlist_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UsuarioPlaylist',
    tableName: process.env.TABLA_USUARIO_PLAYLIST
  });
  return UsuarioPlaylist;
};