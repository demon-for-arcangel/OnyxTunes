require("dotenv").config();
const { Sequelize, Op } = require("sequelize");
const models = require("../models");
const Conexion = require("./connection.js");

const conexion = new Conexion();

/**
 * Conexion de Album
 * @function indexAlbums Obtener los albums
 * @function getAlbumById Obtener un album por su id
 * @function getAlbumByTitle Obtener un album por su titulo
 * @function createAlbum Crear un album
 * @function updateAlbum Actualizar un album
 * @function deleteAlbum Eliminar un album
 * @function getAlbumsByUserId Obtener los albums de un usuario
 */
class AlbumModel {
    constructor() {}

    async indexAlbums() {
        try {
            const albums = await models.Album.findAll({
                include: [{ model: models.Like }]
            });
            return albums;
        } catch (error) {
            console.error('Error al mostrar la lista de los Albums: ', error);
            throw new Error('Error al mostrar la lista de albums');
        }
    }

    async getAlbumById(id) {
        try {
            console.log(id)
            const album = await models.Album.findByPk(id, {
                include: [{ model: models.Like }]
            });
            if (!album) {
                throw new Error('Album no encontrado');
            }
            return album;
        } catch (error) {
            console.error('Error al mostrar el album: ', error);
            throw new Error('Error al mostrar el album');
        }
    }

    async getAlbumByTitle(titulo) {
        try {
            const album = await models.Album.findOne({
                where: { titulo },
                include: [{ model: models.Like }]
            });
    
            return album || null;
        } catch (error) {
            console.error('Error al buscar el álbum por título: ', error);
            throw new Error('Error al buscar el álbum por título');
        }
    }

    async createAlbum(titulo, artista_id, fecha_lanzamiento, likes){
        try {
            const newAlbum = await models.Album.create({
                titulo,
                artista_id,
                fecha_lanzamiento,
                likes
            })

            return newAlbum;
        } catch (error) {
            console.error('Error al crear el album: ', error);
            throw new Error('Error al crear el album.')
        }
    }

    async updateAlbum(albumId, newData) {
        try {
            const album = await models.Album.findByPk(albumId); 
            if (!album) {
                throw new Error('Álbum no encontrado');
            }
            const updatedAlbum = await album.update(newData, {
                include: [{ model: models.Like }]
            }); 
            return updatedAlbum;
        } catch (error) {
            console.error('Error al actualizar el álbum', error);
            throw new Error('Error al actualizar el álbum');
        }
    }    

    async deleteAlbum(albumsIds) {
        try {
            const albumsToDelete = await models.Album.findAll({
                where: {
                    id: albumsIds
                },
                include: [{ model: models.Like }]
            });
    
            if (albumsToDelete.length !== albumsIds.length) {
                throw new Error("Algunos álbumes no fueron encontrados.");
            }
    
            const result = await models.Album.destroy({
                where: {
                    id: albumsIds
                }
            });
    
            return {
                msg: `Se eliminaron ${result} álbum(es) exitosamente.`
            };
        } catch (error) {
            console.error("Error al eliminar álbumes:", error);
            throw new Error("Error al eliminar álbum(es).");
        }
    }    

    async getAlbumsByUserId(userId) {
        try {
            const albums = await models.Album.findAll({
                include: [{
                    model: models.Usuario,
                    through: {
                        where: { usuario_id: userId }
                    }
                }]
            });
    
            const filteredAlbums = albums.filter(album => 
                album.Usuarios.length > 0
            );
    
            if (filteredAlbums.length === 0) {
                console.log(`No se encontraron álbumes para el usuario con ID: ${userId}`);
            }
    
            return filteredAlbums;
        } catch (error) {
            console.error('Error al obtener los álbumes por ID de usuario: ', error);
            throw new Error('Error al obtener los álbumes por ID de usuario');
        }
    }
}

module.exports = AlbumModel;