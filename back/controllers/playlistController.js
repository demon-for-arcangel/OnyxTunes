const { response, request } = require("express");
const Conexion = require("../database/PlaylistConnection");
const models = require('../models');

const conx = new Conexion();

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

const createPlaylist = async (req, res) => {
    const { nombre, descripcion } = req.body;

    try {
        const newPlaylist = await conx.createPlaylist({
            nombre,
            descripcion,
        });

        res.status(201).json({ msg: "Playlist creada con éxito", playlist: newPlaylist });
    } catch (error) {
        console.error("Error al crear la playlist:", error);
        res.status(500).json({ msg: "Error al crear la playlist" });
    }
};

const updatePlaylist = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedPlaylist = await conx.updatePlaylist(id, updatedData);
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

module.exports = {
    index, getPlaylistById, createPlaylist, updatePlaylist, deletePlaylists,
};