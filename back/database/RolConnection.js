require("dotenv").config();
const { Sequelize, Op } = require("sequelize");
const models = require("../models");
const Conexion = require("./connection.js");

const conexion = new Conexion();

class RolModel {
    constructor() {}
    
    async indexRols() {
        try {
            const rols = await models.Rol.findAll();
            return rols;
        }catch (error) {
            console.error('Error al mostrar la lista de roles: ', error);
            throw error;
        }
    }

    async getRolById(id) {
      try {
        const rol = await models.Rol.findByPk(id);
        if (!rol) {
            throw new Error('User no encontrado');
        }
        return rol;
      } catch (error){
        console.error('Error al mostrar el rol: ', error);
        throw error;
      }
    }

    async createRol() {}

    updateRol = async (rolId, newData) => {
        try {
          const rol = await models.Rol.findByPk(rolId);
          if (!rol) {
            throw new Error('Rol no encontrado.');
          }
    
          const updated = await rol.update(newData);
          return updated;
        }catch (error) {
          console.error('Error al actualizar el rol: ', error);
          throw error;
        }
    }

    deleteUsers = async (rolIds) => {
        try {
           if (!Array.isArray(rolIds) || rolIds.length === 0) {
             throw new Error('No se proporcionaron IDs de usuario para eliminar.');
           }
       
           const result = await models.Rol.destroy({
             where: {
               id: rolIds
             }
           });
       
           return { message: `${result} roles eliminados.` };
        } catch (error) {
           console.error('Error al eliminar los roles:', error);
           throw error;
        }
    }
}

module.exports = RolModel;