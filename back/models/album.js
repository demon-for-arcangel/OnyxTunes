'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class album extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.cancion, {
        foreignKey: 'album_id'
      });
    
      this.belongsToMany(models.usuario, {
        through: models.usuario_album,
        foreignKey: 'album_id'
      });
    }
  }
  album.init({
    titulo: DataTypes.STRING,
    artista_id: DataTypes.INTEGER,
    fecha_lanzamiento: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'album',
    tableName: process.env.TABLA_ALBUM
  });
  return album;
};