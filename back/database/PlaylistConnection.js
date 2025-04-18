const { Op, Sequelize } = require("sequelize");
const models = require("../models");
//const { uploadImageToS3 } = require("../helpers/upload-file-aws.js");
const { uploadImageToS3 } = require("../helpers/upload-file-minio.js");
const fs = require("fs");

/**
 * Conexion de Playlist
 * @function index Obtener las playlists
 * @function getPlaylistById Obtener una playlist por su id
 * @function createPlaylist Crear una playlist
 * @function updatePlaylist Actualizar una playlist
 * @function deletePlaylists Eliminar playlists
 * @function getUserPlaylists Obtener las playlists de un usuario
 * @function createPlaylistByUser Crear una playlist por un usuario
 * @function addSongToFavorites Añadir una cancion a favoritos
 * @function deleteSongPlaylist Eliminar una cancion de una playlist
 */
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
        console.log(data);
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
                        attributes: { exclude: ['album_id'] },
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

    async updatePlaylist(playlistId, newData, files) {
        try {            
            const playlist = await models.Playlist.findByPk(playlistId, {
                attributes: { exclude: ['usuario_id'] },
                include: [{ model: models.Like }]
            });
            if (!playlist) {
                console.error("Error: Playlist no encontrada.");
                throw new Error("Playlist no encontrada");
            }
        
            let portadaUrl = playlist.portadaURL; 
    
            if (files && files.portada) {
                const file = files.portada;

                if (!file.mimetype.startsWith("image/")) {
                    throw new Error("Archivo inválido: debe ser una imagen.");
                }

                if (!file.data || file.data.length === 0) {
                    const tempFilePath = file.tempFilePath;
                    if (!tempFilePath) {
                        throw new Error("Archivo inválido: No se pudo leer el contenido.");
                    }
                    file.data = fs.readFileSync(tempFilePath);
                }
    
                const bucketName = process.env.MINIO_BUCKET;
                const folder = "portadas_playlists"; 
    
                const filename = `${folder}/${Date.now()}_${file.name}`;
    
                portadaUrl = await uploadImageToS3(bucketName, filename, file.data);;
            }
        
            const updatedPlaylist = await playlist.update({
                ...newData,
                portadaURL: portadaUrl
            });
    
            return {
                message: "Playlist actualizada con éxito.",
                playlist: updatedPlaylist
            };
        } catch (error) {
            console.error("Error al actualizar la playlist:", error);
            throw new Error("Error al actualizar la playlist.");
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
    
            if (!favoritesPlaylist) {
                favoritesPlaylist = await models.Playlist.create({
                    nombre: 'Favoritos',
                    publico: false
                });
            }
    
            const existingPlaylist = await models.UsuarioPlaylist.findOne({
                attributes: { exclude: ['album_id'] },
                where: {
                    usuario_id: userId,
                    playlist_id: favoritesPlaylist.id 
                }
            });
    
            if (!existingPlaylist) {
                await models.UsuarioPlaylist.create({
                    usuario_id: userId,
                    playlist_id: favoritesPlaylist.id
                });
            }
    
            await favoritesPlaylist.addCanciones(songId); 
    
            const existingLike = await models.Like.findOne({
                where: {
                    usuario_id: userId,
                    entidad_id: songId,
                    entidad_tipo: 'Cancion'
                }
            });
    
            if (!existingLike) {
                await models.Like.create({
                    usuario_id: userId,
                    entidad_id: songId,
                    entidad_tipo: 'Cancion'
                });
            }
    
            return { message: "Canción añadida a Favoritos y añadido a la tabla Like." };
        } catch (error) {
            console.error('Error al añadir la canción a Favoritos:', error);
            throw new Error("Error al añadir la canción a Favoritos.");
        }
    }

    async deleteSongPlaylist(songId, playlistId){
        console.log(songId, playlistId);
        try {
            const playlist = await models.Playlist.findByPk(playlistId, {
                attributes: { exclude: ['usuario_id'] },
            });
            if (!playlist) {
                throw new Error("Playlist no encontrada");
            }
    
            const songInPlaylist = await models.CancionPlaylist.findOne({
                where: {
                    playlist_id: playlistId,
                    cancion_id: songId
                }
            });
    
            if (!songInPlaylist) {
                throw new Error("La canción no está en la playlist");
            }
    
            await models.CancionPlaylist.destroy({
                where: {
                    playlist_id: playlistId,
                    cancion_id: songId
                }
            });
    
            return { message: "Canción eliminada de la playlist." };
        } catch (error) {
            console.error("Error al eliminar la canción de la playlist:", error);
            throw new Error("Error al eliminar la canción de la playlist.");
        }
    }
}

module.exports = PlaylistConnection;
