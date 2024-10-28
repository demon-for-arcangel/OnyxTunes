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
        through: models.RolUsuario,
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

      // Relación de seguidores (usuarios que siguen a este usuario)
      this.belongsToMany(models.Usuario, {
        as: 'seguidores',             // Alias para los seguidores
        through: 'seguidores_relaciones',  // Nombre único para la tabla intermedia
        foreignKey: 'seguido_id'      // Clave foránea de quien es seguido
      });

      // Relación de seguidos (usuarios que este usuario sigue)
      this.belongsToMany(models.Usuario, {
        as: 'siguiendo',              // Alias para los usuarios que este usuario sigue
        through: 'seguidores_relaciones',  // Nombre único para la tabla intermedia
        foreignKey: 'seguidor_id'     // Clave foránea del usuario que sigue
      });
           

      this.hasMany(models.playlist, {
        foreignKey: 'usuario_id'
      });

      this.hasMany(models.reaccion_comentario, {
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
    tableName: process.env.TABLA_USUARIO
  });
  return Usuario;
};