require("dotenv").config();
const { Sequelize, Op } = require("sequelize");
const models = require("../../models");
const Conexion = require("../connection.js");
const bcrypt = require('bcrypt');

const conexion = new Conexion();

class UserModel {
    constructor() {}

    async indexUser() {
        try {
            const users = await models.Usuario.findAll({
                include: [
                    {
                        model: models.Rol,
                        attributes: ['nombre']  
                    }
                ]
            });
            return users;
        } catch (error) {
            console.error('Error al mostrar la lista de usuarios: ', error);
            throw new Error('Error al listar los usuarios');
        }
    }
    

    async indexArtist() {
        try {
            const artists = await models.Usuario.findAll({
                include: [
                    {
                        model: models.Rol,
                        where: { nombre: 'Artista' }, 
                    }
                ]
            });
            
            return artists;
        } catch (error) {
            console.error('Error al mostrar la lista de artistas:', error);
            throw new Error('Error al listar los artistas');
        }
    }

    async getUserById(id) {
        try {
            const user = await models.Usuario.findByPk(id, {
                include: [
                    {
                        model: models.Rol,
                        attributes: ['nombre']
                    }
                ]
            });
    
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
    
            return user;
        } catch (error) {
            console.error('Error al mostrar el usuario: ', error);
            throw new Error('Error al buscar el usuario por su Id');
        }
    }
    

    async getUserByEmail(email) {
        try {
            let user = await models.Usuario.findOne({
                where: {
                    email: email // Buscar solo por email
                },
                include: [
                    {
                        model: models.Rol,
                        attributes: ['nombre'],
                        // Asegúrate de que la relación esté definida correctamente en el modelo
                        required: false // Esto permite que la consulta funcione incluso si no hay rol asociado
                    }
                ]
            });
    
            return user;
        } catch (error) {
            console.error('Error al buscar el usuario por el email:', error);
            throw new Error('Error al buscar el usuario por el email');
        }
    }
  
    async registerUser(userData) {
        try {
            if (!userData) {
                throw new Error('Datos de usuario inválidos');
            }
        
            const newUser = await models.Usuario.create(userData);
        
            if (!newUser) {
                throw new Error('No se pudo crear el usuario');
            }
        
            return newUser;
        } catch (error) {
            console.error('Error al registrar un nuevo usuario:', error);
            throw new Error('Error al registrar al usuario');
        }
    }

    async createUser(nombre, email, hashedPassword, arrRolesName = []) {
        try {
            const newUser = await models.Usuario.create({
                nombre,
                email,
                password: hashedPassword,
                rol
            });
    
            return newUser;
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            throw new Error('Error al crear usuario');
        }
    }   

    updateUser = async (userId, newData) => {
        try {
            const user = await models.Usuario.findByPk(userId);
            if (!user) {
                throw new Error('Usuario no encontrado.');
            }
      
            const updated = await user.update(newData);
            return updated;
          }catch (error) {
            console.error('Error al actualizar el usuario: ', error);
            throw new Error('Erro al actualizar');
        }
    }

    async deleteUsers(userIds) {
        if (!userIds) {
            throw new Error("No se proporcionaron IDs de usuario para eliminar.");
        }

        await models.RolUsuario.destroy({
            where: { usuario_id: userIds }
        });

        const result = await models.Usuario.destroy({
            where: { id: userIds }
        });

        return result;
    }

    async getUserRoles(userId) {
        try {
            const user = await models.Usuario.findByPk(userId, {
                include: [
                    {
                        model: models.Rol,
                        attributes: ['id', 'nombre']
                    }
                ]
            });

            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            return user.roles; 
        } catch (error) {
            console.error('Error al obtener roles del usuario:', error);
            throw new Error('Error al obtenr los roles'); 
        }
    }

    async updatePassword(userId, currentPassword, newPassword, confirmPassword) {
        try {
            const user = await models.Usuario.findByPk(userId);
            if (!user) {
                throw new Error('Usuario no encontrado.');
            }
    
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                throw new Error('La contraseña actual es incorrecta.');
            }
    
            if (newPassword !== confirmPassword) {
                throw new Error('La nueva contraseña y la confirmación no coinciden.');
            }
    
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
            user.password = hashedNewPassword;
            await user.save();
    
            return { message: 'Contraseña actualizada con éxito.' };
        } catch (error) {
            console.error('Error al actualizar la contraseña: ', error);
            throw new Error('Error al actualizar la contraseña');
        }
    }

    async createDefaultPlaylist(userId) {
        try {
            // Verificar si la lista de reproducción "Favoritos" ya existe
            const existingPlaylist = await models.Playlist.findOne({
                where: {
                    nombre: 'Favoritos'
                },
                attributes: { exclude: ['usuario_id'] },
            });
    
            let playlistId;
    
            // Si no existe, crear la lista de reproducción
            if (!existingPlaylist) {
                const newPlaylist = await models.Playlist.create({
                    nombre: 'Favoritos'
                });
                playlistId = newPlaylist.id;
                console.log('Lista de reproducción "Favoritos" creada.');
            } else {
                playlistId = existingPlaylist.id;
                console.log('La lista de reproducción "Favoritos" ya existe.');
            }
    
            // Asociar la lista de reproducción con el usuario en la tabla intermedia
            await models.UsuarioPlaylist.create({
                usuario_id: userId,
                playlist_id: playlistId
            });
    
            console.log('Lista de reproducción "Favoritos" asociada al usuario.');
        } catch (error) {
            console.error('Error al crear o asociar la lista de reproducción "Favoritos":', error);
            throw new Error('Error al crear o asociar la lista de reproducción');
        }
    }
}

module.exports = UserModel;