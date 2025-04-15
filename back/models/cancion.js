'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cancion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Usuario, {
        foreignKey: 'artista_id',
        as: 'artista' 
    });
    
      this.belongsToMany(models.Genero, {
        through: models.GeneroCancion,
        foreignKey: 'cancion_id',
        as: 'generos'
      });
    
      this.belongsToMany(models.Usuario, {
        through: models.UsuarioCancion,
        foreignKey: 'cancion_id',
        as: 'usuario'
      });
    
      this.belongsToMany(models.Playlist, {
        through: models.CancionPlaylist,
        foreignKey: 'cancion_id',
      });

      this.hasMany(models.ReaccionComentario, {
        foreignKey: 'cancion_id',
        as: 'reacciones_comentarios'
      });
    
      this.belongsTo(models.Album, {
        foreignKey: 'album_id'
      });

      this.hasMany(models.Like, { 
        foreignKey: 'entidad_id', 
        constraints: false, 
        scope: {
          entidad_tipo: 'Cancion' 
        }
      });

      this.belongsTo(models.Asset, {
        foreignKey: 'assetId',
        as: 'asset',
      });
    }
  }
  Cancion.init({
    titulo: DataTypes.STRING,
    duracion: DataTypes.INTEGER,
    reproducciones: DataTypes.INTEGER,
    album_id: DataTypes.INTEGER,
    artista_id: DataTypes.INTEGER,
    assetId: DataTypes.INTEGER,
    portadaURL: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Cancion',
    tableName: process.env.TABLA_CANCION
  });
  return Cancion;
};