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
      this.belongsTo(models.Rol, {
        foreignKey: 'id',
      });

      this.belongsToMany(models.Cancion, {
        through: models.UsuarioCancion,
        foreignKey: 'usuario_id'
      });

      this.belongsToMany(models.Album, {
        through: models.UsuarioAlbum,
        foreignKey: 'usuario_id'
      });

      this.belongsToMany(models.Usuario, {
        as: 'seguidores',
        through: models.Seguidores,  
        foreignKey: 'seguido_id'     
      });

      this.belongsToMany(models.Usuario, {
        as: 'siguiendo',              
        through: models.Seguidores,  
        foreignKey: 'seguidor_id'     
      });
           

      this.hasMany(models.Playlist, {
        foreignKey: 'usuario_id'
      });

      this.hasMany(models.ReaccionComentario, {
        foreignKey: 'usuario_id'
      })

      this.hasMany(models.Mensaje, {
        foreignKey: 'emisor',
        as: 'mensajesEnviados',
      })

      this.hasMany(models.Mensaje, {
        foreignKey: 'receptor',
        as: 'mensajesRecibidos',
      })
    }
  }
  Usuario.init({
    nombre: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    nickname: DataTypes.STRING,
    fecha_nacimiento: DataTypes.DATE,
    foto_perfil: DataTypes.STRING,
    direccion: DataTypes.STRING,
    telefono: DataTypes.STRING,
    genero: DataTypes.ENUM('Femenino', 'Masculino', 'Otro'),
    active: DataTypes.BOOLEAN,
    last_login: DataTypes.DATE,
    connected: DataTypes.BOOLEAN,
    rol: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: process.env.TABLA_USUARIO
  });
  return Usuario;
};