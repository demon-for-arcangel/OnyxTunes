require("dotenv").config();
const { Sequelize, Op } = require("sequelize");
const models = require("../models");
const Conexion = require("./connection.js");

const conexion = new Conexion();

class SearchConnection {
    constructor() {}

    async searchSongsByTitle(titulo) {
        try {
            const songs = await models.Cancion.findAll({
                where: {
                    titulo: {
                        [Op.like]: `%${titulo}%`
                    }
                }
            });
            return songs;
        } catch (error) {
            console.error("Error al buscar canciones:", error);
            throw new Error("Error al realizar la búsqueda");
        }
    }

    async searchPlaylistsByName(nombre) {
        try {
            const playlists = await models.Playlist.findAll({
                where: {
                    nombre: {
                        [Op.like]: `%${nombre}%`
                    }
                },
                attributes: { exclude: ['usuario_id'] },
            });
            return playlists;
        } catch (error) {
            console.error("Error al buscar playlists:", error);
            throw new Error("Error al realizar la búsqueda");
        }
    }

    async searchArtistsByName(nombre) {
        try {
            const artists = await models.Usuario.findAll({
                include: [{
                    model: models.Rol, 
                    where: {
                        nombre: 'Artista'
                    }
                }],
                where: {
                    nombre: {
                        [Op.like]: `%${nombre}%`
                    }, 
                }
            });
            return artists;
        } catch (error) {
            console.error("Error al buscar artistas:", error);
            throw new Error("Error al realizar la búsqueda");
        }
    }

    async searchAlbumsByTitle(titulo) {
        try {
            const albums = await models.Album.findAll({
                where: {
                    titulo: {
                        [Op.like]: `%${titulo}%`
                    }
                }
            });
            return albums;
        } catch (error) {
            console.error("Error al buscar álbumes:", error);
            throw new Error("Error al realizar la búsqueda");
        }
    }
}

module.exports = SearchConnection;

