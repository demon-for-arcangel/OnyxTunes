const { response, request } = require("express");
const Conexion = require("../database/AlbumConnection");
const models = require('../models');

const conx = new Conexion();

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
    } catch (error) {
        
    }
}

const createAlbum = async (req, res) => {
    const { } = req.body;

    try {
        const existingAlbum = await conx.getAlbumByTitle(titulo);
        if (existingAlbum) {
            return res.status(400).json({ msg: "El titulo ya lo tiene otro album" });
        }
        const newAlbum = await conx.createAlbum();

        res.status(201).json({ msg: "Album creado exitosamente", album: newAlbum });
    } catch (error) {
        console.error("Error al crear album", error);
        res.status(500).json({ msg: "Error al crear album" });
    }
}

const updateAlbum = async  (req, res) => {
    const albumId = req.params.id;
    const { } = req.body;

    try {
        const existingAlbum = await conx.getAlbumById(albumId);
        if (!existingAlbum) {
            return res.status(404).json({ msg: "Album no encontrado" });
        }

        const updatedData = {

        };

        const udpatedAlbum = await conx.updateAlbum()
        res.status(200).json({ msg: "Album actualizado exitosamente", album: updatedAlbum });
    } catch (error) {
        console.error("Error al actualizar album", error);
        res.status(500).json({ msg: "Error al actualizar album" });
    }
}

const deleteAlbum = async (req, res) => {
    const albumsIds = req.body.albumsIds;

    try {
        if (!Array.isArray(albumsIds) || albumsIds.length === 0) {
            return res.status(400).json({ msg: "No se proporcionaron IDs de usuario para eliminar." });
          }
   
          const result = await conx.deleteAlbum(albumsIds);
          
          res.status(200).json(result);
    } catch (error) {
        console.error('Error al eliminar los usuarios:', error);
        res.status(500).json({ msg: "Error al eliminar los usuarios" }); 
    }
}

module.exports = {
    index, getAlbumById, createAlbum, updateAlbum, deleteAlbum
}