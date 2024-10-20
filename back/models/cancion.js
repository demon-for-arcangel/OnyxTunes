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
      this.belongsToMany(models.Genero, {
        through: models.genero_cancion,
        foreignKey: 'cancion_id'
      });
    
      this.belongsToMany(models.Usuario, {
        through: models.usuario_cancion,
        foreignKey: 'cancion_id'
      });
    
      this.belongsToMany(models.Playlist, {
        foreignKey: 'cancion_id'
      });
    
      this.hasMany(models.Reaccion, {
        foreignKey: 'cancion_id'
      });
    
      this.belongsTo(models.Album, {
        foreignKey: 'album_id'
      });
    }
  }
  Cancion.init({
    titulo: DataTypes.STRING,
    duracion: DataTypes.INTEGER,
    album_id: DataTypes.INTEGER,
    artistaId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cancion',
    tableName: process.env.TABLA_CANCION
  });
  return Cancion;
};