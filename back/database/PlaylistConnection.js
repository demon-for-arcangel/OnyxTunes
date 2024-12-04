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

    async getUserPlaylists(userId) {
        try {
            const playlists = await models.Playlist.findAll({
                attributes: { exclude: ['usuario_id'] },
                include: [
                    {
                        model: models.Usuario, 
                        through: { 
                            attributes: [] 
                        },
                        where: { id: userId } 
                    },
                    { model: models.Like } 
                ]
            });
            return playlists;
        } catch (error) {
            console.error("Error al obtener las playlists del usuario:", error);
            throw new Error("Error al obtener las playlists del usuario.");
        }
    }

    async createPlaylistByUser(data, userId) {
        try {
            // Crea la nueva playlist
            const newPlaylist = await models.Playlist.create(data);
    
            // Asocia la playlist con el usuario en la tabla intermedia
            await models.UsuarioPlaylist.create({
                usuario_id: userId,
                playlist_id: newPlaylist.id
            });
    
            return newPlaylist;
        } catch (error) {
            console.error("Error al crear la playlist:", error);
            throw new Error("Error al crear la playlist");
        }
    }
}

module.exports = PlaylistConnection;
