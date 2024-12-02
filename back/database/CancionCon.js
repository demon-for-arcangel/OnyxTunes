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
                include: [ //añadir la tabla genero
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
                        model: models.Genero, // Incluir el modelo Genero
                        attributes: ['id', 'nombre'], // Especifica los atributos que deseas incluir
                        as: 'generos' // Usa el alias que definiste en la relación
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
                include: [{ model: models.Like }]
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
                include: [{ model: models.Like }]
             });
            return song;
        } catch (error) {
            console.error("Error al buscar canción por título:", error);
            throw new Error("Error al buscar canción por título");
        }
    }
    

    async createSong(songData) {
        try {
            if (!Number.isInteger(songData.duracion)) {
                throw new Error("La duración debe ser un número entero que represente los segundos");
            }

            const newSong = await models.Cancion.create(songData, {
                include: [{ model: models.Like }]
            });
            return newSong;
        } catch (error) {
            console.error("Error al guardar la canción en la base de datos:", error);
            throw new Error("Error al guardar la canción");
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
    
            const result = await models.Cancion.destroy({
                where: {
                    id: {
                        [Op.in]: songsIds,
                    },
                },
                include: [{ model: models.Like }]
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