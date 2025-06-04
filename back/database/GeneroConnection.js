const { Op } = require("sequelize");
const models = require("../models/index");

/**
 * Conexion de Genero
 * @function indexGeneros Obtener los generos
 * @function getGeneroById Obtener un genero por su id
 * @function createGenero Crear un genero
 * @function updateGenero Actualizar un genero
 * @function deleteGeneros Eliminar generos
 */
class GeneroModel {
    constructor() {}

    async indexGeneros() {
        try {
            const generos = await models.Genero.findAll();
            return generos;
        } catch (error) {
            console.error('Error al obtener los géneros: ', error);
            throw new Error('Error al obtener los géneros');
        }
    }

    async getGeneroById(id) {
        try {
            const genero = await models.Genero.findByPk(id);
            if (!genero) {
                throw new Error('Género no encontrado');
            }
            return genero;
        } catch (error) {
            console.error('Error al obtener el género: ', error);
            throw new Error('Error al obtener el género');
        }
    }

    async createGenero(generoData) {
        try {
            const newGenero = await models.Genero.create(generoData);
            return newGenero;
        } catch (error) {
            console.error('Error al crear el género: ', error);
            throw new Error('Error al crear el género');
        }
    }

    async updateGenero(id, updatedData) {
        try {
            const genero = await models.Genero.findByPk(id);
            if (!genero) {
                throw new Error('Género no encontrado');
            }
            const updatedGenero = await genero.update(updatedData);
            return updatedGenero;
        } catch (error) {
            console.error('Error al actualizar el género: ', error);
            throw new Error('Error al actualizar el género');
        }
    }

    async deleteGeneros(generosIds) {
        try {
            const result = await models.Genero.destroy({
                where: {
                    id: {
                        [Op.in]: generosIds, 
                    },
                },
            });

            return result;
        } catch (error) {
            console.error("Error al eliminar los géneros:", error);
            throw new Error("Error al eliminar los géneros.");
        }
    }
}

module.exports = GeneroModel;
