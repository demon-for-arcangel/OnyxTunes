require("dotenv").config();
const { Sequelize, Op } = require("sequelize");
const models = require("../../models");
const Conexion = require("../connection.js");

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
            throw error;
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
            throw error;
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
            throw error;
        }
    }
    

    async getUserByEmail(email) {
        try {
            let user = await models.Usuario.findOne({
                where: {
                    [Op.or]: [
                        { id: email },
                        { email: email }
                    ]
                },
                include: [
                    {
                        model: models.Rol,
                        attributes: ['nombre']
                    }
                ]
            });

            return user;
        } catch (error) {
            throw error;
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
            throw error;
        }
    }

    async createUser(nombre, email, hashedPassword, arrRolesName = []) {
        try {
            const newUser = await models.Usuario.create({
                nombre,
                email,
                password: hashedPassword,
            });
    
            if (arrRolesName.length > 0) {
                await this.createUserRols(newUser.id, arrRolesName);
            }
    
            return newUser;
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            throw new Error('Error al crear usuario');
        }
    }   

    async createUserRols(userId, arrRolesId) {
        let newRoles = [];
        try {
            for (const roleId of arrRolesId) { 
                const role = await models.Rol.findByPk(roleId); 

                if (!role) {
                    throw new Error(`El rol con ID ${roleId} no se encontró.`);
                }

                let newRole = await models.RolUsuario.create({
                    usuario_id: userId,
                    rol_id: role.id 
                });
                newRoles.push(newRole);
            }
        } catch (error) {
            console.error('Error al crear roles de usuario:', error);
            throw error; 
        }
        return newRoles;
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
            throw error;
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
            throw error; 
        }
    }

    async removeUserRole(userId, roleId) {
        try {
            const result = await models.RolUsuario.destroy({
                where: {
                    usuario_id: userId,
                    rol_id: roleId
                }
            });
            return result; 
        } catch (error) {
            console.error('Error al eliminar rol de usuario:', error);
            throw error; 
        }
    }
}

module.exports = UserModel;