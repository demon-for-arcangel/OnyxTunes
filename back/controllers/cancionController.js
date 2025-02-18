const { response, request } = require("express");
const Conexion = require("../database/CancionCon");
const models = require('../models');

const conx = new Conexion();

/**
 * Controlador de Canciones
 * @function index Obtener las canciones
 * @function getSongById Obtener una cancion por su id
 * @function getSongByUser Obtener las canciones de un usuario
 * @function createSong Crear una cancion
 * @function updateSong Actualizar una cancion
 * @function deleteSong Eliminar una cancion
 * @function addToHistory Añadir una cancion al historial
 * @function getHistoryByUser Obtener el historial de un usuario
 */
const index = async (req, res) => {
    try {
        const songs = await conx.indexSongs();
        res.status(200).json(songs);
    } catch (error) {
        console.log('Error al obtener las canciones', error);
        res.status(500).json({})
    }
}

const getSongById = async (req, res) => {
    const songId = req.params.id;

    try {
        const song = await conx.getSongById(songId);

        if (!song) {
            return res.status(404).json({ msg: "Cancion no encontrada" });
        }
        res.status(200).json(song);
    } catch (error) {
        
    }
}

const getSongByUser = async (req, res) => {
    const userId = req.params.userId; 

    try {
        const songs = await conx.getSongByUser(userId);

        if (!songs || songs.length === 0) {
            return res.status(404).json({ msg: "No se encontraron canciones para este usuario." });
        }
        res.status(200).json(songs);
    } catch (error) {
        console.error('Error al obtener las canciones del usuario:', error);
        res.status(500).json({ msg: "Error al obtener las canciones del usuario" });
    }
};

const createSong = async (req, res) => {
    try {
        const result = await conx.createSong(req.body, req.files);
        res.status(201).json(result);
    } catch (error) {
        console.error("Error al crear la canción:", error);
        res.status(500).json({ message: 'Error al crear la canción' });
    }
};

const updateSong = async (req, res) => {
    const songId = req.params.id; 
    const updatedData = req.body;
    const files = req.files; 

    try {
        const existingSong = await conx.getSongById(songId);
        if (!existingSong) {
            return res.status(404).json({ msg: "Canción no encontrada" });
        }

        const updatedSong = await conx.updateSong(songId, updatedData, files); 

        res.status(200).json({ msg: "Canción actualizada exitosamente", song: updatedSong });
    } catch (error) {
        console.error("Error al actualizar la canción:", error);
        res.status(500).json({ msg: "Error al actualizar la canción" });
    }
};


const deleteSong = async (req, res) => {
    const { songsIds } = req.body; 

    try {
        if (!Array.isArray(songsIds) || songsIds.length === 0) {
            return res.status(400).json({ msg: "No se proporcionaron IDs de canciones para eliminar." });
        }

        const result = await conx.deleteSong(songsIds);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error al eliminar las canciones:', error);
        res.status(500).json({ msg: "Error al eliminar las canciones" });
    }
};

const addToHistory = async (req, res) => {
    const { songId, userId } = req.body; 

    console.log('ID de la canción:', songId); 
    console.log('ID del usuario:', userId); 

    if (!songId || !userId) {
        return res.status(400).json({ message: "Faltan datos necesarios" });
    }

    try {
        const newEntry = await conx.addToHistory(songId, userId);
        res.status(201).json({
            message: "Canción añadida al historial",
            entry: newEntry
        });
    } catch (error) {
        console.error("Error al añadir al historial:", error);
        res.status(500).json({ message: "Error al añadir al historial" });
    }
};

const getHistoryByUser = async (req, res) => {
    const userId = req.params.userId; 

    try {
        const history = await conx.getHistoryByUser(userId);

        if (!history || history.length === 0) {
            return res.status(404).json({ msg: "No se encontraron entradas en el historial para este usuario." });
        }
        res.status(200).json(history);
    } catch (error) {
        console.error('Error al obtener el historial:', error);
        res.status(500).json({ msg: "Error al obtener el historial" });
    }
};

module.exports = {
    index, getSongById, createSong, updateSong, deleteSong, getSongByUser,
    addToHistory, getHistoryByUser
}