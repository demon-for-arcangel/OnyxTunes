'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Cancion, {
        foreignKey: 'album_id',
      });
    
      this.belongsToMany(models.Usuario, {
        through: models.UsuarioAlbum,
        foreignKey: 'album_id',
        otherKey: 'usuario_id'
      });

      this.hasMany(models.Like, { 
        foreignKey: 'entidad_id', 
        constraints: false, 
        scope: {
          entidad_tipo: 'Album' 
        }
      });

      this.hasMany(models.Cancion, { 
        foreignKey: "album_id" 
      });
    }
  }
  Album.init({
    titulo: DataTypes.STRING,
    fecha_lanzamiento: DataTypes.DATE,
    portadaURL: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Album',
    tableName: process.env.TABLA_ALBUM
  });
  return Album;
};