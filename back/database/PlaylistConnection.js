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
                include: [
                    { model: models.Like }, // Incluye los "likes"
                    {
                        model: models.Cancion, // Asegúrate de que este modelo esté definido
                        through: { attributes: [] } // Si usas una tabla intermedia, no necesitas atributos de ella
                    }
                ]
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

    async createPlaylist(data, canciones) {
        try {
            // Verifica si ya existe una playlist con el mismo nombre para el usuario
            const existingPlaylist = await models.Playlist.findOne({
                attributes: { exclude: ['usuario_id'] },
                where: {
                    nombre: data.nombre,
                },
                include: [{
                    model: models.Usuario,
                    through: {
                        model: models.UsuarioPlaylist,
                        where: { usuario_id: data.usuario_id } // Verifica si el usuario tiene una playlist con este nombre
                    }
                }]
            });

            if (existingPlaylist) {
                throw new Error("Ya existe una playlist con este nombre para el usuario.");
            }

            // Crea la nueva playlist sin usuario_id
            const { usuario_id, ...playlistData } = data; // Desestructura para eliminar usuario_id
            const newPlaylist = await models.Playlist.create(playlistData);

            // Si hay canciones, inserta las relaciones en la tabla intermedia
            if (canciones && canciones.length > 0) {
                const cancionesData = canciones.map(cancionId => ({
                    playlist_id: newPlaylist.id,
                    cancion_id: cancionId
                }));

                // Inserta las relaciones en la tabla intermedia
                await models.CancionPlaylist.bulkCreate(cancionesData);
            }

            // Asocia la nueva playlist con el usuario en la tabla intermedia
            await models.UsuarioPlaylist.create({
                usuario_id: data.usuario_id, // Usa el ID del usuario del cuerpo de la solicitud
                playlist_id: newPlaylist.id
            });

            return newPlaylist; // Devuelve la nueva playlist creada
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
