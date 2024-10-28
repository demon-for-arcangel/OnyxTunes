require("dotenv").config();
const { Sequelize, Op } = require("sequelize");
const models = require("../../models");
const Conexion = require("../connection.js");

const conexion = new Conexion();

class UserModel {
    constructor() {}

    async indexUser() {
        try {
            const users = await models.User.findAll();
            return users;
        }catch (error) {
            console.error('Error al mostrar la lista de usuarios: ', error);
            throw error;
        }
    }

    async getUserById(id) {
        try {
            const user = await models.User.findByPk(id);
            if (!user) {
                throw new Error('Usuario no encontrado')
            }
            return user;
        }catch (error) {
            console.error('Error al mostrar el usuario: ', error);
            throw error;
        }
    }

    async getUserByEmail(email, userData) {
        try {
           let user = await models.User.findOne({
             where: {
               email: email
             }
           });
           
           return user;
        } catch (error) {
           console.error('Error al obtener o crear usuario por email:', error);
           throw error;
        }
    }

    async registerUser(userData) {
        try {
            if (!userData || typeof userData !== 'object') {
                throw new Error('Datos de usuario inválidos');
            }
        
            const newUser = await models.User.create(userData);
        
            if (!newUser) {
                throw new Error('No se pudo crear el usuario');
            }
        
            return newUser;
        } catch (error) {
            console.error('Error al registrar un nuevo usuario:', error);
            throw error;
        }
    }

    createUserRols = async (userId, arrRolesName) => {
        let newRoles = [];
        try {
           conexion.conectar();
           for (let roleId of arrRolesName) {
                const role = await models.Rol.findOne({
                where: {
                    id: roleId
                }
            });
            if (!role) {
                console.error(`El rol con id ${roleId} no se encontró.`);
            }
            let newRole = await models.UserRols.create({
                id_user: userId,
                id_rol: role.id, 
                id_rol: role.id, 
            });
            newRoles.push(newRole);
           }
        } catch (error) {
           console.error('Error al crear roles de usuario:', error);
           throw error;
        } finally {
           conexion.desconectar();
        }
        return newRoles;
    };

    updateUser = async (userId, newData) => {
        try {
            const user = await models.User.findByPk(userId);
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

    deleteUsers = async (userIds) => {
        try {
            if (!Array.isArray(userIds) || userIds.length === 0) {
                throw new Error('No se proporcionaron IDs de usuario para eliminar.');
            }
        
            const result = await models.User.destroy({
                where: {
                    id: userIds
                }
            });
        
            return { message: `${result} usuarios eliminados.` };
        } catch (error) {
            console.error('Error al eliminar los usuarios:', error);
            throw error;
        }
    }
}

module.exports = UserModel;