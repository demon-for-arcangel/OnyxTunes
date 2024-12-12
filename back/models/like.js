'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
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

      this.belongsTo(models.Cancion, { 
        foreignKey: 'entidad_id', 
        as: 'cancion'
      });

      this.belongsTo(models.Album, {
        foreignKey: 'entidad_id',
        as: 'album'
      })

      this.belongsTo(models.Playlist, { 
        foreignKey: 'entidad_id',
        as: 'playlist',
      });
    }
  }
  Like.init({
    usuario_id: DataTypes.INTEGER,
    entidad_id: DataTypes.INTEGER,
    entidad_tipo: DataTypes.ENUM('Cancion', 'Playlist', 'Album'),
  }, {
    sequelize,
    modelName: 'Like',
    tableName: process.env.TABLA_LIKE
  });
  return Like;
};