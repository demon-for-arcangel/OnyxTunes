const { Op, Sequelize } = require("sequelize");
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
                    { model: models.Like },     
                    {
                        model: models.Cancion, 
                        through: { attributes: [] }, 
                        as: 'canciones',
                        include: [{
                            model: models.Album,
                            attributes: ['id', 'titulo']
                        },
                        {
                            model: models.Asset,
                            attributes: ['id', 'path'],
                            as: 'asset'
                        }]
                    },
           
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
            const existingPlaylist = await models.Playlist.findOne({
                attributes: { exclude: ['usuario_id'] },
                where: {
                    nombre: data.nombre,
                },
                include: [{
                    model: models.Usuario,
                    through: {
                        model: models.UsuarioPlaylist,
                        where: { usuario_id: data.usuario_id } 
                    }
                }]
            });

            if (existingPlaylist) {
                throw new Error("Ya existe una playlist con este nombre para el usuario.");
            }

            const { usuario_id, ...playlistData } = data; 
            const newPlaylist = await models.Playlist.create(playlistData);

            if (Array.isArray(canciones) && canciones.length > 0) {
                const cancionesData = canciones.map(cancionId => ({
                    playlist_id: newPlaylist.id,
                    cancion_id: cancionId
                }));
                await models.CancionPlaylist.bulkCreate(cancionesData);
            }

            await models.UsuarioPlaylist.create({
                usuario_id: data.usuario_id, 
                playlist_id: newPlaylist.id
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
            const newPlaylist = await models.Playlist.create(data);
    
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

    async addSongToFavorites(songId, userId) {
        try {
            if (typeof userId !== 'number') {
                throw new Error("El userId debe ser un número entero.");
            }
    
            let favoritesPlaylist = await models.Playlist.findOne({
                attributes: { exclude: ['usuario_id'] },
                where: { nombre: 'Favoritos' }
            });
    
            let existingPlaylist;
    
            if (favoritesPlaylist) {
                existingPlaylist = await models.UsuarioPlaylist.findOne({
                    where: {
                        usuario_id: userId,
                        playlist_id: favoritesPlaylist.id 
                    }
                });
            }
    
            if (!existingPlaylist) {
                const newFavoritesPlaylist = await models.Playlist.create({
                    nombre: 'Favoritos',
                });
    
                await models.UsuarioPlaylist.create({
                    usuario_id: userId,
                    playlist_id: newFavoritesPlaylist.id
                });
            } else {
                favoritesPlaylist = await models.Playlist.findByPk(
                    existingPlaylist.playlist_id,
                    { attributes: { exclude: ['usuario_id'] } } 
                );
            }
    
            await favoritesPlaylist.addCanciones(songId); 
            return { message: "Canción añadida a Favoritos." };
        } catch (error) {
            console.error('Error al añadir la canción a Favoritos:', error);
            throw new Error("Error al añadir la canción a Favoritos.");
        }
    }
}

module.exports = PlaylistConnection;
