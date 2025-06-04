const FavoritesPlaylistConnection = require("../database/PlaylistFavoriteConnection");

const conx = new FavoritesPlaylistConnection();

/**
 * Controlador de favoritos de playlists
 */
const getFavoritePlaylistsByUser = async (req, res) => {
    try {
        const { usuarioId } = req.params;

        if (!usuarioId) {
            return res.status(400).json({ msg: "usuarioId es requerido." });
        }

        const favorites = await conx.getFavoritePlaylistsByUser(usuarioId);
        res.status(200).json({ msg: "Playlists favoritas obtenidas.", data: favorites });
    } catch (error) {
        console.error("Error al obtener playlists favoritas:", error);
        res.status(500).json({ msg: error.message || "Error interno del servidor" });
    }
};

const addFavoritePlaylist = async (req, res) => {
    try {
        const { usuarioId, playlistId } = req.body;

        if (!usuarioId || !playlistId) {
            return res.status(400).json({ msg: "usuarioId y playlistId son requeridos." });
        }

        const favorite = await conx.addFavoritePlaylist(usuarioId, playlistId);
        res.status(201).json({ msg: "Playlist añadida a favoritos.", data: favorite });
    } catch (error) {
        res.status(500).json({ msg: "Error al añadir playlist a favoritos" });
    }
};

const removeFavoritePlaylist = async (req, res) => {
    try {
        const { usuarioId, playlistId } = req.body;

        if (!usuarioId || !playlistId) {
            return res.status(400).json({ msg: "usuarioId y playlistId son requeridos." });
        }

        const result = await conx.removeFavoritePlaylist(usuarioId, playlistId);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error al eliminar playlist de favoritos:", error);
        res.status(500).json({ msg: error.message || "Error interno del servidor" });
    }
};


module.exports = {
    addFavoritePlaylist, removeFavoritePlaylist, getFavoritePlaylistsByUser
};