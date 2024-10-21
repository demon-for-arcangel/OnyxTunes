'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cancion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.genero, {
        through: models.genero_cancion,
        foreignKey: 'cancion_id'
      });
    
      this.belongsToMany(models.usuario, {
        through: models.usuario_cancion,
        foreignKey: 'cancion_id'
      });
    
      this.belongsToMany(models.playlist, {
        foreignKey: 'cancion_id'
      });
    
      this.hasMany(models.reaccion, {
        foreignKey: 'cancion_id'
      });
    
      this.belongsTo(models.album, {
        foreignKey: 'album_id'
      });
    }
  }
  cancion.init({
    titulo: DataTypes.STRING,
    duracion: DataTypes.INTEGER,
    album_id: DataTypes.INTEGER,
    artista_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'cancion',
    tableName: process.env.TABLA_CANCION
  });
  return cancion;
};