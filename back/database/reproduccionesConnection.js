const { Op, Sequelize } = require("sequelize");
const models = require("../models");

/**
 * Conexion de Reproducciones
 * @function getReproduccionesByUserId Obtener las reproducciones de un usuario
 * @function getReproduccionesByEntidad Obtener las reproducciones de una entidad
 * @function createOrUpdateReproduccion Crear o actualizar una reproduccion
 * @function topReproducciones Obtener las reproducciones mas populares
 */
class ReproduccionConnection {
    /**
     * Funcion para obtener todas las reproducciones de un usuario 
     * en canciones, playlists y albumes
     */
    async getReproduccionesByUserId(usuario_id) {
        try {
            return await models.Reproducciones.findAll({
                where: {
                    usuario_id: usuario_id
                },
                attributes: { exclude: ['cancion_id', 'playlist_id', 'album_id'] }
            });
        } catch (error) {
            console.error("Error al obtener las reproducciones del usuario:", error);
            throw new Error("Error al obtener las reproducciones del usuario");
        }
    }

    /**
     * Funcion para obtener todas las reproducciones de una entidad
     * La entidad puede ser una cancion, una playlist o un album
     */
    async getReproduccionesByEntidad(id, tipo) {
        try {
            return await models.Reproducciones.findAll({
                where: {
                    entidad_id: id,
                    entidad_tipo: tipo
                },
                attributes: { exclude: ['cancion_id', 'playlist_id', 'album_id'] }
            });
        } catch (error) {
            console.error("Error al obtener las reproducciones de la entidad:", error);
            throw new Error("Error al obtener las reproducciones de la entidad");
        }
    }

    /**
     * Funcion para crear o actualizar una reproduccion
     * se crea añadiendo 1 a la cantidad de reproducciones si nunca lo ha reproducido ese usuario
     * si se ha reproducido antes por este usuario, se actualiza la cantidad de reproducciones añadiendo 1    
     */
    async createOrUpdateReproduccion(data) { 
        const { usuario_id, entidad_id, entidad_tipo } = data;

        if (!usuario_id || !entidad_tipo) {
            throw new Error("El usuario_id y entidad_tipo son obligatorios");
        }

        try {
            const existingReproduccion = await models.Reproducciones.findOne({
                where: {
                    usuario_id,
                    entidad_id,
                    entidad_tipo
                },
                attributes: { exclude: ['cancion_id', 'playlist_id', 'album_id'] } 
            });

            if (existingReproduccion) {
                existingReproduccion.reproducciones += 1;
                return await existingReproduccion.save();
            } else {
                return await models.Reproducciones.create({
                    usuario_id,
                    entidad_id,
                    entidad_tipo,
                    reproducciones: 1, 
                    fecha: new Date() 
                });
            }
        } catch (error) {
            console.error("Error al crear o actualizar la reproducción:", error);
            throw new Error("Error al crear o actualizar la reproducción");
        }
    }

    /**
     * Funcion para obtener las canciones, albums y playlists mas populares
     * añadiendo un atributo en la respuesta llamado total_reproducciones que sera la suma
     * de las reproducciones de las canciones, albums o playlists
     */
    async topReproducciones(limit) {
        try {
            const canciones = await models.Reproducciones.findAll({
                where: { entidad_tipo: 'Cancion' },
                attributes: { exclude: ['cancion_id', 'playlist_id', 'album_id'] }
            });
    
            const albums = await models.Reproducciones.findAll({
                where: { entidad_tipo: 'Album' },
                attributes: { exclude: ['cancion_id', 'playlist_id', 'album_id'] }
            });
    
            const playlists = await models.Reproducciones.findAll({
                include: {
                    model: models.Playlist,
                    attributes: { exclude: ['usuario_id'] },
                    where: { publico: true }
                },
                where: {
                    entidad_tipo: 'Playlist' 
                },
                attributes: { exclude: ['cancion_id', 'playlist_id', 'album_id'] }
            });
    
            const cancionesSumadas = {};
            const albumsSumados = {};
            const playlistsSumadas = {};
    
            for (let i = 0; i < canciones.length; i++) {
                const cancion = canciones[i];
                if (!cancionesSumadas[cancion.entidad_id]) {
                    cancionesSumadas[cancion.entidad_id] = 0;
                }
                cancionesSumadas[cancion.entidad_id] += cancion.reproducciones;
            }
    
            for (let i = 0; i < albums.length; i++) {
                const album = albums[i];
                if (!albumsSumados[album.entidad_id]) {
                    albumsSumados[album.entidad_id] = 0;
                }
                albumsSumados[album.entidad_id] += album.reproducciones;
            }
    
            for (let i = 0; i < playlists.length; i++) {
                const playlist = playlists[i];
                if (!playlistsSumadas[playlist.entidad_id]) {
                    playlistsSumadas[playlist.entidad_id] = 0;
                }
                playlistsSumadas[playlist.entidad_id] += playlist.reproducciones;
            }
    
            const topCanciones = [];
            for (const id in cancionesSumadas) {
                topCanciones.push({ entidad_id: id, total_reproducciones: cancionesSumadas[id] });
            }
            topCanciones.sort((a, b) => b.total_reproducciones - a.total_reproducciones);
            topCanciones.splice(limit); 
    
            const topAlbums = [];
            for (const id in albumsSumados) {
                topAlbums.push({ entidad_id: id, total_reproducciones: albumsSumados[id] });
            }
            topAlbums.sort((a, b) => b.total_reproducciones - a.total_reproducciones);
            topAlbums.splice(limit);
    
            const topPlaylists = [];
            for (const id in playlistsSumadas) {
                topPlaylists.push({ entidad_id: id, total_reproducciones: playlistsSumadas[id] });
            }
            topPlaylists.sort((a, b) => b.total_reproducciones - a.total_reproducciones);
            topPlaylists.splice(limit);

            if (topCanciones.length === 0) {
                const allCanciones = await models.Cancion.findAll({ attributes: ["id", "titulo", "duracion", "portadaURL"] });
                topCanciones.push(...this.getRandomElements(allCanciones, limit));
            }

            if (topAlbums.length === 0) {
                const allAlbums = await models.Album.findAll({ attributes: ["id", "titulo"] });
                topAlbums.push(...this.getRandomElements(allAlbums, limit));
            }

            if (topPlaylists.length === 0) {
                const allPlaylists = await models.Playlist.findAll({ where: { publico: true }, attributes: ["id", "nombre"] });
                topPlaylists.push(...this.getRandomElements(allPlaylists, limit));
            }
    
            return {
                canciones: topCanciones,
                albums: topAlbums,
                playlists: topPlaylists
            };
        } catch (error) {
            console.error("Error al obtener las reproducciones más populares:", error);
            throw new Error("Error al obtener las reproducciones más populares");
        }
    }

    getRandomElements(array, count) {
        const shuffled = array.sort(() => 0.5 - Math.random()); 
        return shuffled.slice(0, count); 
    }
}

module.exports = ReproduccionConnection;
