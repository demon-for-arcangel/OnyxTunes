const { Op } = require("sequelize");
const models = require("../models/index");

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

    async deleteGenero(id) {
        try {
            const genero = await models.Genero.findByPk(id);
            if (!genero) {
                throw new Error('Género no encontrado');
            }
            await genero.destroy();
            return true;
        } catch (error) {
            console.error('Error al eliminar el género: ', error);
            throw new Error('Error al eliminar el género');
        }
    }
}

module.exports = GeneroModel;
