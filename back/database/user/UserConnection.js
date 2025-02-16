require("dotenv").config();
const { Sequelize, Op } = require("sequelize");
const models = require("../../models");
const Conexion = require("../connection.js");
const bcrypt = require("bcrypt");
const fs = require('fs');

//const { uploadImageToS3 } = require("../../helpers/upload-file-aws.js");
const { uploadImageToS3 } = require("../../helpers/upload-file-minio.js");

const conexion = new Conexion();

/**
 * Conexion de Usuario
 * @function indexUser Obtener los usuarios
 * @function indexUser Obtener los usuarios
 * @function indexArtist Obtener los artistas
 * @function getUserById Obtener un usuario por su id
 * @function getUserByEmail Obtener un usuario por su email
 * @function registerUser Registrar un usuario
 * @function createUser Crear un usuario
 * @function updateUser Actualizar un usuario
 * @function deleteUsers Eliminar usuarios
 * @function updatePassword Actualizar la contraseña de un usuario
 * @function createDefaultPlaylist Crear una playlist por defecto para un usuario
 */
class UserModel {
  constructor() {}
  async indexUser() {
    try {
      const users = await models.Usuario.findAll({
        include: [
          {
            model: models.Rol,
            attributes: ["nombre"],
          },
        ],
      });
      return users;
    } catch (error) {
      console.error("Error al mostrar la lista de usuarios: ", error);
      throw new Error("Error al listar los usuarios");
    }
  }

  async indexArtist() {
    try {
      const artists = await models.Usuario.findAll({
        include: [
          {
            model: models.Rol,
            where: { nombre: "Artista" },
            attributes: ["nombre"],
          },
        ],
      });

      console.log(artists);

      return artists;
    } catch (error) {
      console.error("Error al mostrar la lista de artistas:", error);
      throw new Error("Error al listar los artistas");
    }
  }

  async getUserById(id) {
    try {
      const user = await models.Usuario.findByPk(id, {
        include: [
          {
            model: models.Rol,
            attributes: ["nombre"],
          },
        ],
      });

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      return user;
    } catch (error) {
      console.error("Error al mostrar el usuario: ", error);
      throw new Error("Error al buscar el usuario por su Id");
    }
  }

  async getUserByEmail(email) {
    try {
      let user = await models.Usuario.findOne({
        where: {
          email: email,
        },
        include: [
          {
            model: models.Rol,
            attributes: ["nombre"],
            required: false,
          },
        ],
      });

      return user;
    } catch (error) {
      console.error("Error al buscar el usuario por el email:", error);
      throw new Error("Error al buscar el usuario por el email");
    }
  }

  async registerUser(userData) {
    try {
      if (!userData) {
        throw new Error("Datos de usuario inválidos");
      }

      const newUser = await models.Usuario.create(userData);

      if (!newUser) {
        throw new Error("No se pudo crear el usuario");
      }

      return newUser;
    } catch (error) {
      console.error("Error al registrar un nuevo usuario:", error);
      throw new Error("Error al registrar al usuario");
    }
  }

  async createUser(nombre, email, hashedPassword, arrRolesName = []) {
    try {
      const newUser = await models.Usuario.create({
        nombre,
        email,
        password: hashedPassword,
        rol,
      });

      return newUser;
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      throw new Error("Error al crear usuario");
    }
  }

  async updateUser(userId, updatedData, files) {
    try {
        const user = await models.Usuario.findByPk(userId);
        if (!user) {
            throw new Error("Usuario no encontrado.");
        }

        let assetPath = user.foto_perfil; 

        if (files && files.imageni) {
            const file = files.imageni;
            if (!file.mimetype.startsWith("image/")) {
                throw new Error("Archivo inválido: debe ser una imagen.");
            }

            if (!file.data || file.data.length === 0) {
                const tempFilePath = file.tempFilePath;
                if (!tempFilePath) {
                    throw new Error("Archivo inválido: No se pudo leer el contenido.");
                }
                file.data = fs.readFileSync(tempFilePath); 
            }

            const bucketName = process.env.MINIO_BUCKET;
            const folder = "fotos_perfil";
            
            const filename = `${folder}/${Date.now()}_${file.name}`;

            assetPath = await uploadImageToS3(filename, bucketName, file.data);  
        }

        const updatedUser = await user.update({
          ...updatedData,
          foto_perfil: assetPath
        });

        return {
            message: "Usuario actualizado con éxito.",
            usuario: updatedUser,
        };
    } catch (error) {
        console.error("Error al actualizar el usuario:", error.message);
        throw new Error("Error al actualizar el usuario.");
    }
}

  async deleteUsers(userIds) {
    //revisar, no elimina las playlist que son exclusivas del usuario
    if (!userIds) {
      throw new Error("No se proporcionaron IDs de usuario para eliminar.");
    }

    await models.UsuarioPlaylist.destroy({
      where: {
        usuario_id: userIds,
      },
    });

    const playlistsToDelete = await models.UsuarioPlaylist.findAll({
      where: {
        usuario_id: userIds,
      },
      include: {
        model: models.Playlist,
        attributes: ["id", "nombre"],
      },
    });

    for (const playlist of playlistsToDelete) {
      const playlistId = playlist.Playlist.id;

      const otherUsersCount = await models.UsuarioPlaylist.count({
        where: {
          playlist_id: playlistId,
          usuario_id: {
            [Op.ne]: userIds,
          },
        },
      });

      console.log(
        `Usuarios restantes en la playlist ${playlistId}: ${otherUsersCount}`,
      );

      if (otherUsersCount === 0) {
        await models.Playlist.destroy({
          where: { id: playlistId },
        });
        console.log(`Playlist con id ${playlistId} eliminada.`);
      } else {
        console.log(
          `La playlist con id ${playlistId} no se elimina porque está asociada a otros usuarios.`,
        );
      }
    }

    const result = await models.Usuario.destroy({
      where: { id: userIds },
    });

    return result;
  }

  async updatePassword(userId, currentPassword, newPassword, confirmPassword) {
    try {
      const user = await models.Usuario.findByPk(userId);
      if (!user) {
        throw new Error("Usuario no encontrado.");
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        throw new Error("La contraseña actual es incorrecta.");
      }

      if (newPassword !== confirmPassword) {
        throw new Error("La nueva contraseña y la confirmación no coinciden.");
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedNewPassword;
      await user.save();

      return { message: "Contraseña actualizada con éxito." };
    } catch (error) {
      console.error("Error al actualizar la contraseña: ", error);
      throw new Error("Error al actualizar la contraseña");
    }
  }

  async createDefaultPlaylist(userId) {
    try {
      const existingPlaylist = await models.Playlist.findOne({
        where: {
          nombre: "Favoritos",
        },
        attributes: { exclude: ["usuario_id"] },
      });

      let playlistId;

      if (!existingPlaylist) {
        const newPlaylist = await models.Playlist.create({
          nombre: "Favoritos",
        });
        playlistId = newPlaylist.id;
        console.log('Lista de reproducción "Favoritos" creada.');
      } else {
        playlistId = existingPlaylist.id;
        console.log('La lista de reproducción "Favoritos" ya existe.');
      }

      await models.UsuarioPlaylist.create({
        usuario_id: userId,
        playlist_id: playlistId,
      });

      console.log('Lista de reproducción "Favoritos" asociada al usuario.');
    } catch (error) {
      console.error(
        'Error al crear o asociar la lista de reproducción "Favoritos":',
        error,
      );
      throw new Error("Error al crear o asociar la lista de reproducción");
    }
  }
}

module.exports = UserModel;





