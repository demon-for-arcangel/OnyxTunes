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
    try {
        // Obtener el ID de los parámetros de la solicitud
        const { id } = req.params;

        // Validar que el ID sea un número
        if (isNaN(id)) {
            return res.status(400).json({ msg: "El ID debe ser un número" });
        }

        // Llamar a la función del modelo para obtener el rol por ID
        const rol = await conx.getRolById(id);

        // Devolver el rol encontrado
        res.status(200).json(rol);
    } catch (error) {
        console.error('Error al obtener el rol por ID', error);

        // Manejar el error de rol no encontrado
        if (error.message === 'User no encontrado') {
            return res.status(404).json({ msg: "Rol no encontrado" });
        }

        // Manejar otros errores
        res.status(500).json({ msg: "Error al obtener el rol" });
    }
};

module.exports = {
    getRoles, getRolById
}
