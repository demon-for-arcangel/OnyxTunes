const { response, request } = require("express");
const Conexion = require("../database/CancionCon");
const models = require('../models');

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

const createSong = async (req, res) => {
    try {
      const { titulo, duracion, likes, reproducciones, album_id, artista_id } = req.body;

      console.log('datos', req.body)
      const newSong = await models.Cancion.create({
        titulo,
        duracion, 
        likes: likes || 0,
        reproducciones: reproducciones || 0,
        album_id,
        artista_id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
  
      return res.status(201).json({
        message: 'Canción creada con éxito',
        cancion: newSong
      });
    } catch (error) {
      console.error('Error al crear la canción:', error);
      return res.status(500).json({
        message: 'Error al guardar la canción en la base de datos',
        error: error.message
      });
    }
  }

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
    index, getSongById, createSong, updateSong, deleteSong
}