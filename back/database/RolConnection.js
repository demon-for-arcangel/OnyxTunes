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
}

module.exports = RolModel;