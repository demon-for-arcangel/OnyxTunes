require("dotenv").config();
const { Sequelize } = require("sequelize");
const models = require("../models");

/**
 * Conexión de favoritos de playlists
 * @function addFavoritePlaylist Añadir una playlist a favoritos
 */
class PlaylistFavoriteConnection {
    constructor() {}

async getFavoritePlaylistsByUser(usuarioId) {
    try {
        const favorites = await models.FavoritesPlaylist.findAll({
            where: { usuario_id: usuarioId },
            attributes: ["playlist_id"]
        });

        if (!favorites.length) {
            return { msg: "No tienes playlists favoritas aún.", data: [] };
        }

        const playlistIds = favorites.map(fav => fav.playlist_id);

        if (!playlistIds.length) {
            return { msg: "No se encontraron playlists favoritas.", data: [] };
        }

        const playlists = await models.Playlist.findAll({
            where: { id: playlistIds }
        });

        return { playlists };
    } catch (error) {
        console.error("Error al obtener playlists favoritas:", error);
        return { msg: "Error interno del servidor.", error: error.message };
    }
}
async addFavoritePlaylist(usuarioId, playlistId) {
    try {
        const playlist = await models.Playlist.findByPk(playlistId, {
            include: [{
                model: models.Usuario,
                through: models.UsuarioPlaylist, 
                attributes: ['id', 'email'] // 🔹 Obtener el ID y email del creador
            }]
        });

        if (!playlist) {
            throw new Error("La playlist no existe.");
        }

        const creador = playlist.Usuarios.find(usuario => usuario.email === "onyxtunes@gmail.com");

        if (!playlist.publico && !creador) { 
            throw new Error("No puedes añadir una playlist privada a favoritos, ya que no fue creada por 'onyxtunes@gmail.com'.");
        }

        const favorite = await models.FavoritesPlaylist.create({
            usuario_id: usuarioId,
            playlist_id: playlistId
        });

        console.log("Playlist añadida a favoritos correctamente.");
        return favorite;
    } catch (error) {
        console.error("Error al agregar playlist a favoritos:", error);
        throw error;
    }
}

    async removeFavoritePlaylist(usuarioId, playlistId) {
        try {
            const favorite = await models.FavoritesPlaylist.findOne({
                where: { usuario_id: usuarioId, playlist_id: playlistId }
            });

            if (!favorite) throw new Error("No se encontró la playlist en favoritos.");

            await favorite.destroy();
            return { msg: "Playlist eliminada de favoritos." };
        } catch (error) {
            console.error("Error al eliminar playlist de favoritos:", error);
            throw error;
        }
    }

}

module.exports = PlaylistFavoriteConnection