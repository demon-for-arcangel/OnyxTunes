const { Op } = require("sequelize");
const models = require("../models");

/**
 * Conexion de Like
 * @function getLikesUserId Obtener los likes de un usuario
 * @function deleteLike Eliminar un like
 */
class LikeConnection {
    async getLikesUserId(userId) {
        try {
            const likes = await models.Like.findAll({
                where: {
                    usuario_id: userId
                },
                include: [
                    {
                        model: models.Cancion,
                        as: 'cancion',
                        attributes: ['id', 'titulo']
                    }
                ]
            });
            return likes;
        } catch (error) {
            console.error("Error al obtener los likes del usuario");
            throw new Error("error al obtener los likes del usuario")
        }
    }

    async deleteLike(likeId) {
        console.log("Intentando eliminar el like con ID:", likeId);
        try {
            const like = await models.Like.findOne({
                where: { 
                    id: likeId 
                }
            });

            if (!like) {
                throw new Error("like no encontrado.");
            }

            await models.Like.destroy({
                where: {
                    id: likeId
                }
            });

            if (like.entidad_tipo === 'Cancion') {
                const favoritesPlaylist = await models.Playlist.findOne({
                    attributes: { exclude: ['usuario_id'] }, 
                    where: {
                        nombre: 'Favoritos'
                    }
                });
                console.log('Playlist', favoritesPlaylist);

                if (favoritesPlaylist) {
                    console.log(like.usuario_id);
                    const userPlaylist = await models.UsuarioPlaylist.findOne({
                        attributes: { exclude: ['album_id'] }, 
                        where: {
                            usuario_id: like.usuario_id,
                            playlist_id: favoritesPlaylist.id
                        }
                    });
                    console.log('usuarioPlaylist', userPlaylist);

                    if (userPlaylist) {
                        await models.CancionPlaylist.destroy({
                            where: {
                                playlist_id: favoritesPlaylist.id,
                                cancion_id: like.entidad_id 
                            }
                        });
                    }
                }
            }

            return { msg: "Eliminado like de la canción y eliminada canción de la playlist" };
        } catch (error) {
            console.error("Error al eliminar el like:", error);
            throw new Error("Error al eliminar el like.");
        }
    }
}

module.exports = LikeConnection