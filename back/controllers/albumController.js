const { response, request } = require("express");
const Conexion = require("../database/AlbumConnection");
const models = require('../models');

const conx = new Conexion();

/**
 * Controlador de Albums
 * @function index Obtener los albums
 * @function getAlbumById Obtener un album por su id
 * @function createAlbum Crear un album
 * @function updateAlbum Actualizar un album
 * @function deleteAlbum Eliminar un album
 * @function getAlbumsByUserId Obtener los albums de un usuario
 */
const index = async (req, res) => {
    try {
        const albums = await conx.indexAlbums();
        res.status(200).json(albums);
    } catch (error) {
        console.log('Error al obtener los albums', error);
        res.status(500).json({})
    }
}

const getAlbumById = async (req, res) => {
    const albumId = req.params.id;

    try {
        const album = await conx.getAlbumById(albumId);

        if (!album) {
            return res.status(404).json({ msg: "Album no encontrado" });
        }
        res.status(200).json(album);
    } catch (error) {
        
    }
}

const createAlbum = async (req, res) => {
    const { titulo, artista_id, fecha_lanzamiento, likes } = req.body;

    try {
        const existingAlbum = await conx.getAlbumByTitle(titulo);

        if (existingAlbum) {
            return res.status(400).json({ msg: "El título ya lo tiene otro álbum" });
        }

        const newAlbum = await conx.createAlbum(titulo, artista_id, fecha_lanzamiento, likes);
        res.status(201).json({ msg: "Álbum creado exitosamente", album: newAlbum });
    } catch (error) {
        console.error("Error al crear álbum", error);
        res.status(500).json({ msg: "Error al crear álbum" });
    }
};


const updateAlbum = async (req, res) => {
    const albumId = req.params.id;
    const newData = req.body; 

    try {
        const updatedAlbum = await conx.updateAlbum(albumId, newData);
        res.status(200).json({ msg: "Álbum actualizado exitosamente", album: updatedAlbum });
    } catch (error) {
        console.error("Error al actualizar álbum", error);
        res.status(500).json({ msg: "Error al actualizar álbum" });
    }
};


const deleteAlbum = async (req, res) => {
    const albumsIds = req.body.albumsIds;

    try {
        if (!Array.isArray(albumsIds) || albumsIds.length === 0) {
            return res.status(400).json({ msg: "No se proporcionaron IDs de álbum para eliminar." });
        }

        const result = await conx.deleteAlbum(albumsIds);

        res.status(200).json(result);
    } catch (error) {
        console.error("Error al eliminar álbum(es):", error);
        res.status(500).json({ msg: "Error al eliminar álbum(es)." });
    }
};

const getAlbumsByUserId = async (req, res) => {
    const userId = req.params.userId;
    console.log(userId);

    try {
        const albums = await conx.getAlbumsByUserId(userId);
        if (albums.length === 0) {
            return res.status(404).json({ msg: "No se encontraron álbumes para el usuario." });
        }
        res.status(200).json(albums);
    } catch (error) {
        console.error("Error al obtener los álbumes por usuario:", error);
        res.status(500).json({ msg: "Error al obtener los álbumes por usuario." });
    }
}

module.exports = {
    index, getAlbumById, createAlbum, updateAlbum, deleteAlbum, getAlbumsByUserId
}