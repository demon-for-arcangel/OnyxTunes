const { response, request } = require("express");
const Conexion = require("../database/RolConnection");

const conx = new Conexion();

const getRoles = async (req, res) => {
    try {
        const roles = await conx.indexRols();
        res.status(200).json(roles);
    } catch (error) {
        console.error('Error al obtener los roles', error);
        res.status(500).json({ msg: "Error"});
    }
}

const getRolById = async (req, res) => {
    
}

module.exports = {
    getRoles
}
