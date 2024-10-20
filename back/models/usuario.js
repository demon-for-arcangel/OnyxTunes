'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Rol, {
        through: models.Rol_Usuario,
        foreignKey: 'usuario_id'
      });

      this.belongsToMany(models.Cancion, {
        through: models.Usuario_Cancion,
        foreignKey: 'usuario_id'
      });

      this.belongsToMany(models.Album, {
        through: models.Usuario_Album,
        foreignKey: 'usuario_id'
      });

      this.belongsToMany(models.Usuario, {
        as: 'Seguidores',
        through: 'seguidores',
        foreignKey: 'usuario_id'
      });

      this.belongsToMany(models.Usuario, {
        as: 'Seguidos',
        through: 'seguidores',
        foreignKey: 'seguido_id'
      });

      this.hasMany(models.Playlist, {
        foreignKey: 'usuario_id'
      });

      this.hasMany(models.Reaccion, {
        foreignKey: 'usuario_id'
      })
    }
  }
  Usuario.init({
    nombre: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    fecha_nacimiento: DataTypes.DATE,
    foto_perfil: DataTypes.STRING,
    direccion: DataTypes.STRING,
    telefono: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: process.env.TABLA_USUARIOS
  });
  return Usuario;
};