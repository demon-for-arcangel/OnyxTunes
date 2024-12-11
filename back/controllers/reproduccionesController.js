const { response, request } = require("express");
const Conexion = require("../database/reproduccionesConnection");

const conx = new Conexion();

const getReproduccionesByUserId = async (req, res) => {
    const { id } = req.params;
    try {
        const reproducciones = await conx.getReproduccionesByUserId(id);
        if (!reproducciones || reproducciones.length === 0) {
            return res.status(404).json({ message: 'No se encontraron reproducciones para este usuario' });
        }
        res.json(reproducciones);
    } catch (error) {
        console.error("Error al obtener las reproducciones del usuario:", error);
        res.status(500).json({ message: 'Error al obtener las reproducciones del usuario' });
    }
};

const getReproduccionesByEntidad = async (req, res) => {
    const { id, tipo } = req.body; 
    try {
        const reproducciones = await conx.getReproduccionesByEntidad(id, tipo);
        if (!reproducciones || reproducciones.length === 0) {
            return res.status(404).json({ message: 'No se encontraron reproducciones para esta entidad' });
        }
        res.json(reproducciones);
    } catch (error) {
        console.error("Error al obtener las reproducciones de la entidad:", error);
        res.status(500).json({ message: 'Error al obtener las reproducciones de la entidad' });
    }
};

const createOrUpdateReproduccion = async (req, res) => {
    const { usuario_id, entidad_id, entidad_tipo } = req.body;
    try {
        const reproduccion = await conx.createOrUpdateReproduccion({
            usuario_id,
            entidad_id,
            entidad_tipo,
        });
        res.status(201).json(reproduccion);
    } catch (error) {
        console.error("Error al crear o actualizar la reproducción:", error);
        res.status(500).json({ message: 'Error al crear o actualizar la reproducción' });
    }
};

const getTopReproducciones = async (req, res) => {
    const { limit } = req.query; 
    try {
        const topReproducciones = await conx.topReproducciones(limit ? parseInt(limit) : 10);
        res.json(topReproducciones);
    } catch (error) {
        console.error("Error al obtener las reproducciones más populares:", error);
        res.status(500).json({ message: 'Error al obtener las reproducciones más populares' });
    }
};

module.exports = {
    getReproduccionesByUserId, getReproduccionesByEntidad, createOrUpdateReproduccion,
    getTopReproducciones
}