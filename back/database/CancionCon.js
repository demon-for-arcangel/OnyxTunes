require("dotenv").config();
const { Sequelize, Op } = require("sequelize");
const models = require("../models/index.js");
const Conexion = require("./connection.js");
// Usar para subir archivos en local
//const { subirArchivo } = require("../helpers/subir-archivo.js");
const { uploadAudioToS3, uploadImageToS3 } = require("../helpers/upload-file-minio.js")
const crypto = require('crypto');
const fs = require("fs");

const conexion = new Conexion();

/**
 * Conexion de Cancion
 * @function indexSongs Obtener las canciones
 * @function getSongById Obtener una cancion por su id
 * @function getSongByTitle Obtener una cancion por su titulo
 * @function getSongByUser Obtener las canciones de un usuario
 * @function createSong Crear una cancion
 * @function updateSong Actualizar una cancion
 * @function deleteSong Eliminar una cancion
 * @function addToHistory Añadir una cancion al historial
 * @function getHistoryByUser Obtener el historial de un usuario
 */
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
                        as: 'generos',
                        through: { attributes: [] } 
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
                throw new Error('Cancion no encontrada');
            }
    
            console.log("✅ Canción obtenida con IDs de géneros:", song);
            return song;
        } catch (error) {
            console.error('❌ Error al mostrar la canción: ', error);
            throw new Error('Error al mostrar la canción');
        }
    }

    async getGenreBySong(songId) {
        console.log("cancion id", songId)
        if (!songId || isNaN(Number(songId))) {
            throw new Error(`⚠ Error: ID de canción inválido. Valor recibido: ${songId}`);
        }
        try {
            const song = await models.Cancion.findByPk(songId, {
                include: [
                    {
                        model: models.Genero,
                        attributes: ["id", "nombre"],
                        as: "generos",
                        through: { attributes: [] }, // 🔹 Evita que `GeneroCancion` agregue datos innecesarios
                    },
                ],
            });
    
            if (!song) {
                throw new Error(`⚠ Canción con ID ${songId} no encontrada.`);
            }
    
            console.log("✅ Géneros obtenidos:", song.generos);
            return song.generos;
        } catch (error) {
            console.error("❌ Error al obtener los géneros de la canción:", error);
            throw new Error("Error al obtener los géneros de la canción.");
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

    async createSongs(data, files) {
        try {
            let { duracion, likes, reproducciones, album_id, artista_id, generos = [], colaboradores = [] } = data;
    
            const bucketName = process.env.AWS_BUCKET;
            const folder = "canciones";
    
            let cancionesCreadas = [];

            console.log("Contenido de colaboradores:", colaboradores);
            console.log("generos", generos);
            console.log("Generos recibidos (tipo y contenido)", generos, typeof generos)
            if (typeof generos === "string") {
                generos = generos.split(",").map(num => parseInt(num.trim(), 10));
            }
            console.log("Géneros convertidos a array:", generos, typeof generos);

            let colaboradoresList = colaboradores;
            if (typeof colaboradores === "string") {
                colaboradoresList = colaboradores.split(",").map(num => parseInt(num.trim(), 10));
            }
    
            const archivos = Array.isArray(files.archivo) ? files.archivo : [files.archivo];
    
            for (const file of archivos) {
                if (!file.mimetype.startsWith("audio/")) {
                    throw new Error(`Archivo inválido: ${file.name} debe ser un archivo de audio válido.`);
                }
    
                if (!file.data || file.data.length === 0) {
                    const tempFilePath = file.tempFilePath;
                    if (!tempFilePath) {
                        throw new Error(`Archivo inválido: No se pudo leer el contenido del archivo ${file.name}.`);
                    }
    
                    const fs = require("fs");
                    file.data = fs.readFileSync(tempFilePath);
                }
    
                const originalFileName = file.name;
                const titulo = originalFileName.split(".").slice(0, -1).join(".");
                const filename = `${folder}/${originalFileName}`;
                const fileUrl = await uploadAudioToS3(filename, bucketName, file.data);
    
                const newAsset = await models.Asset.create({
                    path: fileUrl,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
    
                const assetId = newAsset.id;
    
                const newSong = await models.Cancion.create({
                    titulo,
                    duracion,
                    likes: likes || 0,
                    reproducciones: reproducciones || 0,
                    album_id: album_id || null,
                    artista_id,
                    assetId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
    
                if (Array.isArray(generos) && generos.length > 0) {
                    console.log("Procesando asignación de géneros...");
                
                    for (const generoId of generos) {
                        try {
                            const generoExistente = await models.Genero.findByPk(generoId);
                            if (!generoExistente) {
                                console.log(`Género con ID ${generoId} no existe en la base de datos.`);
                                continue;
                            }
                
                            await models.GeneroCancion.create({
                                cancion_id: newSong.id,
                                genero_id: generoId,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            });
                
                            console.log(`Género ${generoId} asignado correctamente a la canción ${newSong.id}`);
                        } catch (error) {
                            console.error(`Error al asignar género ${generoId} a la canción ${newSong.id}:`, error);
                        }
                    }
                }
                

                if (Array.isArray(colaboradoresList) && colaboradoresList.length > 0) {
                    console.log("hola");
                    for (const userId of colaboradoresList) {
                        try {
                            await models.cancionColaborador.create({
                                usuario_id: userId,
                                cancion_id: newSong.id,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            });
                            console.log(`Colaborador ${userId} insertado en la canción ${newSong.id}`);
                        } catch (error) {
                            console.error(`Error al insertar colaborador ${userId}:`, error);
                        }
                    }
                }
                cancionesCreadas.push(newSong);
            }
            return { message: "Canciones creadas con éxito", canciones: cancionesCreadas };
        } catch (error) {
            console.error("Error al crear las canciones:", error.message);
            throw new Error("Error al crear las canciones");
        }
    }

    async updateSong(songId, updatedData, files) {
        try {
            const song = await models.Cancion.findByPk(songId, {
                include: [{ model: models.Like }]
            });
    
            if (!song) {
                throw new Error('Canción no encontrada');
            }
    
            let portadaPath = song.portadaURL;
    
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
                const folder = "portadas_canciones";
                const filename = `${folder}/${Date.now()}_${file.name}`;
                portadaPath = await uploadImageToS3(bucketName, filename, file.data);
            }
    
            const updatedSong = await song.update({
                ...updatedData,
                portadaURL: portadaPath,
            });
    
            if (typeof updatedData.colaboradores === "string") {
                updatedData.colaboradores = updatedData.colaboradores.split(",").map(num => parseInt(num.trim(), 10));
            }
    
            if (updatedData.colaboradores && Array.isArray(updatedData.colaboradores)) {
                await models.CancionColaborador.destroy({ where: { cancion_id: songId } });
    
                for (const userId of updatedData.colaboradores) {
                    try {
                        await models.CancionColaborador.create({
                            usuario_id: userId,
                            cancion_id: songId,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        });
                        console.log(`✅ Colaborador ${userId} asignado a la canción ${songId}`);
                    } catch (error) {
                        console.error(`Error al añadir colaborador ${userId}:`, error);
                    }
                }
            }
    
            if (typeof updatedData.generos === "string") {
                updatedData.generos = updatedData.generos.split(",").map(num => parseInt(num.trim(), 10));
            }
    
            if (updatedData.generos && Array.isArray(updatedData.generos)) {
                await models.GeneroCancion.destroy({ where: { cancion_id: songId } });
    
                for (const generoId of updatedData.generos) {
                    try {
                        const generoExistente = await models.Genero.findByPk(generoId);
                        if (!generoExistente) {
                            console.log(`Género con ID ${generoId} no existe en la base de datos.`);
                            continue;
                        }
    
                        await models.GeneroCancion.create({
                            cancion_id: songId,
                            genero_id: generoId,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        });
    
                        console.log(`Género ${generoId} asignado correctamente a la canción ${songId}`);
                    } catch (error) {
                        console.error(`Error al asignar género ${generoId} a la canción ${songId}:`, error);
                    }
                }
            }
    
            return {
                message: "Canción actualizada con éxito.",
                cancion: updatedSong,
            };
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

            await models.Recomendacion.destroy({
                where: {
                    cancion_id: {
                        [Op.in]: songsIds,
                    },
                },
            });

            await models.CancionPlaylist.destroy({
                where: {
                    cancion_id: {
                        [Op.in]: songsIds,
                    },
                },
            });
    
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
                usuario_id: userId, 
                cancion_id: songId,
                fecha_reproduccion: new Date() 
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