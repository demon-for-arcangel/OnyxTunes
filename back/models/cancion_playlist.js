'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CancionPlaylist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CancionPlaylist.init({
    cancion_id: DataTypes.INTEGER,
    playlist_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CancionPlaylist',
    tableName: process.env.TABLA_CANCION_PLAYLIST
  });
  return CancionPlaylist;
};