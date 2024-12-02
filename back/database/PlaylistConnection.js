const { Op } = require("sequelize");
const models = require("../models");

class PlaylistConnection {
    async index() {
        try {
            const playlists = await models.Playlist.findAll({
                attributes: { exclude: ['usuario_id'] },
                include: [{ model: models.Like }] 
            });
            return playlists;
        } catch (error) {
            console.error("Error al obtener las playlists:", error);
            throw new Error("Error al obtener las playlists.");
        }
    }

    async getPlaylistById(id) {
        try {
            const playlist = await models.Playlist.findByPk(id, {
                attributes: { exclude: ['usuario_id'] },
                include: [{ model: models.Like }] 
            });
            if (!playlist) {
                throw new Error("Playlist no encontrada");
            }
            return playlist;
        } catch (error) {
            console.error("Error al obtener la playlist:", error);
            throw new Error("Error al obtener la playlist");
        }
    }

    async createPlaylist(data) {
        try {
            const newPlaylist = await models.Playlist.create(data, {
                attributes: { exclude: ['usuario_id'] },
            });
            return newPlaylist;
        } catch (error) {
            console.error("Error al crear la playlist:", error);
            throw new Error("Error al crear la playlist");
        }
    }

    async updatePlaylist(playlistId, newData) {
        try {
            const playlist = await models.Playlist.findByPk(playlistId, {
                attributes: { exclude: ['usuario_id'] },
                include: [{ model: models.Like }] 
            });
            if (!playlist) {
                throw new Error("Playlist no encontrada");
            }
            const updatedPlaylist = await playlist.update(newData);
            return updatedPlaylist;
        } catch (error) {
            console.error("Error al actualizar la playlist:", error);
            throw new Error("Error al actualizar la playlist");
        }
    }

    async deletePlaylists(playlistIds) {
        try {
            const playlistsToDelete = await models.Playlist.findAll({
                attributes: { exclude: ['usuario_id'] },
                where: {
                    id: playlistIds
                },
                include: [{ model: models.Like }]
            });

            if (playlistsToDelete.length !== playlistIds.length) {
                throw new Error("Algunas playlists no fueron encontradas.");
            }

            const result = await models.Playlist.destroy({
                where: {
                    id: playlistIds
                }
            });

            return {
                msg: `Se eliminaron ${result} playlist(s) exitosamente.`
            };
        } catch (error) {
            console.error("Error al eliminar playlists:", error);
            throw new Error("Error al eliminar playlists.");
        }
    }
}

module.exports = PlaylistConnection;
