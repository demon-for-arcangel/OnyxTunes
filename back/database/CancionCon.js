require("dotenv").config();
const { Sequelize, Op } = require("sequelize");
const models = require("../models/index.js");
const Conexion = require("./connection.js");
const { subirArchivo } = require("../helpers/subir-archivo.js");

const conexion = new Conexion();

class SongModel {
    constructor() {}

    async indexSongs() {
        try {
            const songs = await models.Cancion.findAll({
                include: [ 
                    {
                        model: models.Usuario, 
                        attributes: ['id', 'nombre'],
                        as: 'artista'
                    },
                    {
                        model: models.Album, 
                        attributes: ['id', 'titulo'] 
                    },
                    {
                        model: models.Genero, 
                        attributes: ['id', 'nombre'], 
                        as: 'generos' 
                    },
                    {
                        model: models.Asset,
                        attributes: ['id', 'path'],
                        as: 'asset'
                    },
                    { model: models.Like } 
                ],
            });
            return songs;
        } catch (error) {
            console.error('Error al mostrar la lista de las Canciones: ', error);
            throw new Error('Error al mostrar la lista de canciones');
        }
    }

    async getSongById(id) {
        try {
            const song = await models.Cancion.findByPk(id, {
                include: [ 
                    {
                        model: models.Usuario, 
                        attributes: ['id', 'nombre'],
                        as: 'artista'
                    },
                    {
                        model: models.Album, 
                        attributes: ['id', 'titulo'] 
                    },
                    {
                        model: models.Genero, 
                        attributes: ['id', 'nombre'], 
                        as: 'generos' 
                    },
                    {
                        model: models.Asset,
                        attributes: ['id', 'path'],
                        as: 'asset'
                    },
                    { model: models.Like } 
                ],
            });
            if (!song) {
                throw new Error('Cancion no encontrado');
            }
            return song;
        } catch (error) {
            console.error('Error al mostrar la cancion: ', error);
            throw new Error('Error al mostrar la cancion');
        }
    }

    async getSongByTitle(titulo) {
        try {
            const song = await models.Cancion.findOne({ 
                where: { titulo },
                include: [ 
                    {
                        model: models.Usuario, 
                        attributes: ['id', 'nombre'],
                        as: 'artista'
                    },
                    {
                        model: models.Album, 
                        attributes: ['id', 'titulo'] 
                    },
                    {
                        model: models.Genero, 
                        attributes: ['id', 'nombre'], 
                        as: 'generos' 
                    },
                    {
                        model: models.Asset,
                        attributes: ['id', 'path'],
                        as: 'asset'
                    },
                    { model: models.Like } 
                ],
             });
            return song;
        } catch (error) {
            console.error("Error al buscar canción por título:", error);
            throw new Error("Error al buscar canción por título");
        }
    }

    async getSongByUser(userId) {
        try {
            const songs = await models.Cancion.findAll({
                where: {
                    artista_id: userId 
                },
                include: [
                    {
                        model: models.Usuario,
                        attributes: ['id', 'nombre'],
                        as: 'artista'
                    },
                    {
                        model: models.Album,
                        attributes: ['id', 'titulo']
                    },
                    {
                        model: models.Genero,
                        attributes: ['id', 'nombre'],
                        as: 'generos'
                    },
                    {
                        model: models.Asset,
                        attributes: ['id', 'path'],
                        as: 'asset'
                    },
                    { model: models.Like }
                ],
            });
            return songs;
        } catch (error) {
            console.error('Error al obtener las canciones del usuario:', error);
            throw new Error('Error al obtener las canciones del usuario');
        }
    }

    async createSong(data, files) {
        try {
            const { titulo, duracion, likes, reproducciones, album_id, artista_id, generos = [] } = data;

            let assetId = null;

            if (files && files.archivo) {
                const nombreArchivo = await subirArchivo(files, ['mp3'], 'canciones');
                const newAsset = await models.Asset.create({
                    path: nombreArchivo,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                assetId = newAsset.id;
            }

            const newSong = await models.Cancion.create({
                titulo,
                duracion,
                likes: likes || 0,
                reproducciones: reproducciones || 0,
                album_id,
                artista_id,
                assetId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            if (Array.isArray(generos) && generos.length > 0) {
                const generosExistentes = await models.Genero.findAll({
                    where: { id: generos },
                });
                await newSong.setGeneros(generosExistentes);
            }

            return { message: "Canción creada con éxito", cancion: newSong };
        } catch (error) {
            console.error("Error al crear la canción:", error);
            throw new Error('Error al crear la canción');
        }
    }
    

    async updateSong(songId, updatedData) {
        try {
            const song = await models.Cancion.findByPk(songId, {
                include: [{ model: models.Like }]
            });
            if (!song) {
                throw new Error('Canción no encontrada');
            }
            
            const updatedSong = await song.update(updatedData);
            return updatedSong;
        } catch (error) {
            console.error('Error al actualizar la canción:', error);
            throw new Error('Error al actualizar la canción');
        }
    }
     
    async deleteSong(songsIds) { //mirar para incluir los assets
        try {
            if (!Array.isArray(songsIds) || songsIds.length === 0) {
                throw new Error("Debe proporcionar una lista de IDs de canciones para eliminar.");
            }
    
            const songsToDelete = await models.Cancion.findAll({
                where: {
                    id: {
                        [Op.in]: songsIds,
                    },
                },
                include: [
                    {
                        model: models.Album,
                        required: false 
                    },
                    {
                        model: models.Genero, 
                        as: 'generos',
                        through: { 
                            attributes: [] 
                        }
                    }
                ]
            });
    
            for (const song of songsToDelete) {
                await song.setGeneros([]); 
            }
    
            const result = await models.Cancion.destroy({
                where: {
                    id: {
                        [Op.in]: songsIds,
                    },
                },
            });
    
            if (result === 0) {
                throw new Error("No se encontraron canciones para eliminar.");
            }
    
            return { message: `${result} canciones eliminadas correctamente.` };
        } catch (error) {
            console.error("Error al eliminar canciones:", error);
            throw new Error("Error al eliminar las canciones.");
        }
    }


    async addToHistory(songId, userId) {
        try {
            const newEntry = await models.Historial.create({
                usuario_id: userId, // Asegúrate de que este campo esté presente
                cancion_id: songId,
                fecha_reproduccion: new Date() // O la fecha que desees
            });
            console.log("Nueva entrada en el historial:", newEntry);
            return newEntry;
        } catch (error) {
            console.error("Error al agregar al historial:", error);
            throw new Error("Error al agregar al historial");
        }
    }

    async getHistoryByUser(userId) {
        try {
            const history = await models.Historial.findAll({
                where: { usuario_id: userId },
                include: [
                    {
                        model: models.Cancion,
                        as: 'cancion',
                        attributes: ['id', 'titulo'] 
                    },
                    {
                        model: models.Usuario,
                        as: 'usuario',
                        attributes: ['id', 'nombre'] 
                    }
                ],
                order: [['fecha_reproduccion', 'DESC']] 
            });
            return history;
        } catch (error) {
            console.error("Error al obtener el historial:", error);
            throw new Error("Error al obtener el historial");
        }
    }
}

module.exports = SongModel;