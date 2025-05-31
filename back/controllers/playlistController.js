const { response, request } = require("express");
const fs = require('fs');
const path = require('path');
const Conexion = require("../database/PlaylistConnection");
const ConexionAssets = require('../database/AssetConnection')
const models = require('../models');

const conx = new Conexion();
const conxAsset = new ConexionAssets();

/**
 * Controlador de Playlists
 * @function index Obtener las playlists
 * @function getPlaylistById Obtener una playlist por su id
 * @function createPlaylist Crear una playlist
 * @function updatePlaylist Actualizar una playlist
 * @function deletePlaylists Eliminar playlists
 * @function getUserPlaylists Obtener las playlists de un usuario
 * @function createPlaylistByUser Crear una playlist por un usuario
 * @function addToFavorites Añadir una cancion a favoritos al dar like a la cancion
 * @function deleteSongPlaylist Eliminar una cancion de una playlist
 */
const index = async (req, res) => {
    try {
        const playlists = await conx.index();
        res.status(200).json(playlists);
    } catch (error) {
        console.error("Error al obtener las playlists:", error);
        res.status(500).json({ msg: "Error al obtener las playlists" });
    }
};

const getPlaylistById = async (req, res) => {
    const { id } = req.params;

    try {
        const playlist = await conx.getPlaylistById(id);
        if (!playlist) {
            return res.status(404).json({ msg: "Playlist no encontrada" });
        }
        res.status(200).json(playlist);
    } catch (error) {
        console.error("Error al obtener la playlist:", error);
        res.status(500).json({ msg: "Error al obtener la playlist" });
    }
};

const createPlaylist = async (req, res = response) => {
    try {
        const { nombre, descripcion, usuario_id, canciones, publico } = req.body;

        const newPlaylist = await conx.createPlaylist({
            nombre,
            descripcion,
            usuario_id,
            canciones,
            publico
        });

        res.status(201).json(newPlaylist);
    } catch (error) {
        console.error("Error al crear la playlist:", error);
        res.status(500).json({ error: error.message });
    }
};

const updatePlaylist = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    const files = req.files;
  
    try {
      const updatedPlaylist = await conx.updatePlaylist(id, updatedData, files);
      res.status(200).json({ msg: "Playlist actualizada con éxito", playlist: updatedPlaylist });
    } catch (error) {
      console.error("Error al actualizar la playlist:", error);
      res.status(500).json({ msg: "Error al actualizar la playlist" });
    }
  };
  

const deletePlaylists = async (req, res) => {
    const { playlistIds } = req.body;

    try {
        if (!Array.isArray(playlistIds) || playlistIds.length === 0) {
            return res.status(400).json({ msg: "No se proporcionaron IDs de playlists para eliminar." });
        }

        const result = await conx.deletePlaylists(playlistIds);
        res.status(200).json({ msg: `${result} playlists eliminadas exitosamente.` });
    } catch (error) {
        console.error("Error al eliminar las playlists:", error);
        res.status(500).json({ msg: "Error al eliminar las playlists." });
    }
};

const getUserPlaylists = async (req, res) => {
    const { userId } = req.params; 

    try {
        const playlists = await conx.getUserPlaylists(userId);
        res.status(200).json({ success: true, data: playlists });
    } catch (error) {
        console.error("Error al obtener las playlists del usuario:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const createPlaylistByUser = async (req, res) => {
    const { nombre, descripcion } = req.body;
    const userId = req.params.userId; 

    try {
        const newPlaylist = await conx.createPlaylistByUser({
            nombre,
            descripcion,
        }, userId); 

        res.status(201).json({ msg: "Playlist creada con éxito", playlist: newPlaylist });
    } catch (error) {
        console.error("Error al crear la playlist:", error);
        res.status(500).json({ msg: "Error al crear la playlist" });
    }
};

const addToFavorites = async (req, res) => {
    const { songId, userId } = req.body;

    try {
        const result = await conx.addSongToFavorites(songId, userId);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error al añadir la canción a Favoritos:', error);
        return res.status(500).json({ msg: "Error al añadir la canción a Favoritos." });
    }
};

const deleteSongPlaylist = async (req, res) => {
    const { playlistId, songId } = req.body;

    try {
        const result = await conx.deleteSongPlaylist(songId, playlistId);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error al eliminar la canción de la playlist:", error);
        res.status(500).json({ msg: "Error al eliminar la canción de la playlist." });
    }
};


const createPlaylistsByGenres = async (req, res) => {
    try {
        const result = await conx.createPlaylistsByGenres();
        res.status(201).json({ msg: "Playlists por género creadas con éxito", data: result });
    } catch (error) {
        console.error("Error al crear playlists por género:", error);
        res.status(500).json({ msg: "Error al crear playlists por género." });
    }
};



module.exports = {
    index, getPlaylistById, createPlaylist, updatePlaylist, deletePlaylists, 
    getUserPlaylists, createPlaylistByUser, addToFavorites, deleteSongPlaylist, 
    createPlaylistsByGenres
};