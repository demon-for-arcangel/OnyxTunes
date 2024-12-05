require("dotenv").config();
const { Sequelize, Op } = require("sequelize");
const models = require("../models/index.js");
const Conexion = require("./connection.js");

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
                    artista_id: userId // Suponiendo que 'artista_id' es la clave foránea en la tabla Cancion
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
                    { model: models.Like }
                ],
            });
            return songs;
        } catch (error) {
            console.error('Error al obtener las canciones del usuario:', error);
            throw new Error('Error al obtener las canciones del usuario');
        }
    }

    async createSong(songData) {
        try {
            if (!Number.isInteger(songData.duracion)) {
                throw new Error("La duración debe ser un número entero que represente los segundos.");
            }
    
            const newSong = await models.Cancion.create(songData);
            console.log("Nueva canción creada:", newSong);
    
            if (songData.generos && Array.isArray(songData.generos) && songData.generos.length > 0) {
                console.log("Géneros a relacionar:", songData.generos);
    
                await newSong.setGeneros(songData.generos);
                console.log("Relaciones con géneros creadas.");
            } else {
                console.warn("No se proporcionaron géneros o el array está vacío.");
            }
    
            return newSong;
        } catch (error) {
            console.error("Error al guardar la canción en la base de datos:", error);
            throw new Error("Error al guardar la canción.");
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
     

    async deleteSong(songsIds) {
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
}

module.exports = SongModel;