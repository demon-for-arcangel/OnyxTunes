const { response, request } = require("express");
const Conexion = require("../database/CancionCon");
const models = require('../models');
const { subirArchivo } = require('../helpers/subir-archivo');

const conx = new Conexion();

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
    const userId = req.params.userId; // Suponiendo que el ID del usuario se pasa como parámetro en la URL

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
        const { titulo, duracion, likes, reproducciones, album_id, artista_id, generos } = req.body;

        console.log('Datos recibidos:', req.body);

        let assetId = null;

        if (req.files && req.files.archivo) { 
            const nombreArchivo = await subirArchivo(req.files, ['mp3'], 'canciones'); 
            
            const newAsset = await models.Asset.create({
                path: nombreArchivo,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            assetId = newAsset.id; 
        } else {
            console.error("No se recibió ningún archivo.");
        }

        const newSong = await models.Cancion.create({
            titulo,
            duracion,
            likes: likes || 0,
            reproducciones: reproducciones || 0,
            album_id,
            artista_id,
            assetId,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log("Canción creada:", newSong);

        if (Array.isArray(generos) && generos.length > 0) {
            const generosExistentes = await models.Genero.findAll({
                where: {
                    id: generos,
                },
            });

            if (generosExistentes.length !== generos.length) {
                console.warn(
                    "Algunos géneros no fueron encontrados en la base de datos. IDs encontrados:",
                    generosExistentes.map(g => g.id)
                );
            }

            await newSong.setGeneros(generosExistentes);
            console.log("Relaciones con géneros creadas.");
        }

        return res.status(201).json({
            message: "Canción creada con éxito",
            cancion: newSong,
        });
    } catch (error) {
        console.error("Error al crear la canción:", error);
        return res.status(500).json({
            message: "Error al guardar la canción en la base de datos",
            error: error.message,
        });
    }
};

  const updateSong = async (req, res) => {
    const songId = req.params.id; 
    const updatedData = req.body;

    try {
        const existingSong = await conx.getSongById(songId);
        if (!existingSong) {
            return res.status(404).json({ msg: "Canción no encontrada" });
        }

        const updatedSong = await conx.updateSong(songId, updatedData);

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


module.exports = {
    index, getSongById, createSong, updateSong, deleteSong, getSongByUser
}