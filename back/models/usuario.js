'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.rol, {
        through: models.rol_usuario,
        foreignKey: 'usuario_id'
      });

      this.belongsToMany(models.cancion, {
        through: models.usuario_cancion,
        foreignKey: 'usuario_id'
      });

      this.belongsToMany(models.album, {
        through: models.usuario_album,
        foreignKey: 'usuario_id'
      });

      this.belongsToMany(models.usuario, {
        as: 'seguidores',
        through: 'seguidores',
        foreignKey: 'usuario_id'
      });

      this.belongsToMany(models.usuario, {
        as: 'seguidos',
        through: 'seguidores',
        foreignKey: 'seguido_id'
      });

      this.hasMany(models.playlist, {
        foreignKey: 'usuario_id'
      });

      this.hasMany(models.reaccion_comentario, {
        foreignKey: 'usuario_id'
      })
    }
  }
  usuario.init({
    nombre: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    fecha_nacimiento: DataTypes.DATE,
    foto_perfil: DataTypes.STRING,
    direccion: DataTypes.STRING,
    telefono: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'usuario',
    tableName: process.env.TABLA_USUARIO
  });
  return usuario;
};