const { response, request } = require("express");
const Conexion = require("../database/RolConnection");

const conx = new Conexion();

/**
 * Controlador de Roles
 * @function getRoles Obtener los roles
 * @function getRolById Obtener un rol por su id
 */
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
    try {
        const { id } = req.params;

        const rol = await conx.getRolById(id);
        res.status(200).json(rol);
    } catch (error) {
        if (error.message === 'User no encontrado') {
            return res.status(404).json({ msg: "Rol no encontrado" });
        }
        res.status(500).json({ msg: "Error al obtener el rol" });
    }
};

module.exports = {
    getRoles, getRolById
}
