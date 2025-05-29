require("dotenv").config();
const { Sequelize, Op } = require("sequelize");
const models = require("../models");
const Conexion = require("./connection.js");
const fs = require('fs');
const { uploadImageToS3 } = require("../helpers/upload-file-minio.js");

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
                include: [
                    { model: models.Like },
                    {
                        model: models.Cancion, 
                        include: [
                            {
                                model: models.Usuario, 
                                as: "artista",
                            },
                            {
                                model: models.Genero,
                                as: "generos",
                            }
                        ]
                    }
                ]
            });

            const albumsTotal = albums.map(album => {
                return {
                    ...album.toJSON(),
                    totalCanciones: album.Cancions ? album.Cancions.length : 0
                };
            });
    
            return albumsTotal;
        } catch (error) {
            console.error('Error al mostrar la lista de los Albums: ', error);
            throw new Error('Error al mostrar la lista de albums');
        }
    }

    async getAlbumById(id) {
        try {
            console.log(id);
            const album = await models.Album.findByPk(id, {
                include: [
                    {
                        model: models.Like
                    },
                    {
                        model: models.Cancion, 
                        include: [
                            {
                                model: models.Usuario, 
                                as: "artista",
                            },
                            {
                                model: models.Genero, 
                                as: "generos",
                            }
                        ]
                    }
                ]
            });
    
            if (!album) {
                throw new Error('Álbum no encontrado');
            }
    
            const totalCanciones = album.Cancions ? album.Cancions.length : 0;
    
            return {
                album,
                totalCanciones
            };
        } catch (error) {
            console.error('Error al mostrar el álbum: ', error);
            throw new Error('Error al mostrar el álbum');
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

    async updateAlbum(albumId, updatedData, files) {
        try {
            const album = await models.Album.findByPk(albumId);
            if (!album) {
                throw new Error("Álbum no encontrado.");
            }
    
            let portadaPath = album.portadaURL; 
    
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
                const folder = "portadas_album";
    
                const filename = `${folder}/${Date.now()}_${file.name}`;
    
                portadaPath = await uploadImageToS3(bucketName, filename, file.data);
            }
    
            const updatedAlbum = await album.update({
                ...updatedData,
                portadaURL: portadaPath, 
            });
    
            return {
                message: "Álbum actualizado con éxito.",
                album: updatedAlbum,
            };
        } catch (error) {
            console.error("Error al actualizar el álbum:", error.message);
            throw new Error("Error al actualizar el álbum.");
        }
    }

    async deleteAlbum(albumsIds) {
        try {
            await models.UsuarioAlbum.destroy({
                where: {
                    album_id: albumsIds, 
                }
            });
    
            console.log(`Relaciones eliminadas para álbumes: ${albumsIds}`);
    
            const result = await models.Album.destroy({
                where: {
                    id: albumsIds
                }
            });
    
            console.log(`Álbum(es) eliminados: ${result}`);
    
            return {
                msg: `Se eliminaron ${result} álbum(es) exitosamente.`,
            };
        } catch (error) {
            console.error("Error al eliminar álbum(es):", error);
            throw new Error("Error al eliminar álbum(es). Verifica las relaciones y los permisos.");
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