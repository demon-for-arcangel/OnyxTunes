const { Op } = require("sequelize");
const models = require("../models");

class PlaylistConnection {
    async index() {
        try {
            const playlists = await models.Playlist.findAll({
                attributes: { exclude: ['usuario_id'] } 
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
                attributes: { exclude: ['usuario_id'] }
            });
            if (!playlist) throw new Error("Playlist no encontrada");
            return playlist;
        } catch (error) {
            console.error("Error al obtener la playlist:", error);
            throw new Error("Error al obtener la playlist.");
        }
    }

    async createPlaylist(data) {
        try {
            return await models.Playlist.create(data);
        } catch (error) {
            console.error("Error al crear la playlist:", error);
            throw new Error("Error al crear la playlist.");
        }
    }

    async updatePlaylist(id, updatedData) {
        try {
            const playlist = await models.Playlist.findByPk(id, {
                attributes: { exclude: ['usuario_id'] }
            });
            if (!playlist) throw new Error("Playlist no encontrada");

            return await playlist.update(updatedData);
        } catch (error) {
            console.error("Error al actualizar la playlist:", error);
            throw new Error("Error al actualizar la playlist.");
        }
    }

    async deletePlaylists(ids) {
        try {
            return await models.Playlist.destroy({
                where: {
                    id: {
                        [Op.in]: ids,
                    },
                },
            });
        } catch (error) {
            console.error("Error al eliminar las playlists:", error);
            throw new Error("Error al eliminar las playlists.");
        }
    }
}

module.exports = PlaylistConnection;
