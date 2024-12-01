require("dotenv").config();
const { Sequelize, Op } = require("sequelize");
const models = require("../models");
const Conexion = require("./connection.js");

const conexion = new Conexion();

class AlbumModel {
    constructor() {}

    async indexAlbums() {
        try {
            const albums = await models.Album.findAll();
            return albums;
        } catch (error) {
            console.error('Error al mostrar la lista de los Albums: ', error);
            throw new Error('Error al mostrar la lista de albums');
        }
    }

    async getAlbumById(id) {
        try {
            console.log(id)
            const album = await models.Album.findByPk(id);
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
            // Busca el álbum por su título
            const album = await models.Album.findOne({
                where: { titulo },
            });
    
            // Si no se encuentra el álbum, devuelve null
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
            const updatedAlbum = await album.update(newData); 
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
                }
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
}

module.exports = AlbumModel;