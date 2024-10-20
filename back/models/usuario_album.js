'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usuario_album extends Model {
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
    
      this.belongsTo(models.Album, {
        foreignKey: 'album_id'
      });
    }
  }
  usuario_album.init({
    usuario_id: DataTypes.INTEGER,
    album_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'usuario_album',
    tableName: process.env.TABLA_USUARIO_ALBUM
  });
  return usuario_album;
};