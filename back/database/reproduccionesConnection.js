const { Op, Sequelize } = require("sequelize");
const models = require("../models");

class ReproduccionConnection {
    /**
     * Funcion para obtener todas las reproducciones de un usuario 
     * en canciones, playlists y albumes
     * @param {*} usuario_id 
     * @returns 
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
     * @param {*} id 
     * @param {*} tipo 
     * @returns 
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
     * @param {*} data 
     * @returns 
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
}

module.exports = ReproduccionConnection;
