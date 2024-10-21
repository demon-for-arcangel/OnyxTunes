'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cancion_playlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  cancion_playlist.init({
    cancion_id: DataTypes.INTEGER,
    playlist_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'cancion_playlist',
  });
  return cancion_playlist;
};