const { Op } = require("sequelize");
const models = require("../models/index");

/**
 * Conexion de Preferencias
 * @function indexPreferences Obtener las preferencias
 * @function getPreferenceById Obtener una preferencia por su id
 * @function createPreference Crear una preferencia
 * @function updatePreference Actualizar una preferencia
 * @function deletePreference Eliminar una preferencia
 */
class PreferencesModel {
    constructor() {}

    async indexPreferences() {
        try {
            const preferences = await models.Preferences.findAll();
            return preferences;
        } catch (error) {
            console.error('Error al obtener las preferencias: ', error);
            throw error;
        }
    }

    async getPreferenceById(id) {
        try {
            const preference = await models.Preferences.findByPk(id);
            if (!preference) {
                throw new Error('Preferencia no encontrada');
            }
            return preference;
        } catch (error) {
            console.error('Error al obtener la preferencia: ', error);
            throw new Error('Error al obtener la preferencia');
        }
    }

    async createPreference(preferenceData) {
        try {
            const existingPreference = await models.Preferences.findOne({
                where: {
                    usuario_id: preferenceData.usuario_id,
                    entidad_tipo: preferenceData.entidad_tipo
                }
            });

            if (existingPreference) {
                throw new Error('El usuario ya tiene una preferencia de este tipo');
            }

            const newPreference = await models.Preferences.create(preferenceData);
            return newPreference;
        } catch (error) {
            console.error('Error al crear la preferencia: ', error);
            throw error;
        }
    }

    async updatePreference(id, updatedData) {
        try {
            const preference = await models.Preferences.findByPk(id);
            if (!preference) {
                throw new Error('Preferencia no encontrada');
            }
            const updatedPreference = await preference.update(updatedData);
            return updatedPreference;
        } catch (error) {
            console.error('Error al actualizar la preferencia: ', error);
            throw new Error('Error al actualizar la preferencia');
        }
    }

    async deletePreference(id) {
        try {
            const preference = await models.Preferences.findByPk(id);
            if (!preference) {
                throw new Error('Preferencia no encontrada');
            }
            await preference.destroy();
            return true;
        } catch (error) {
            console.error('Error al eliminar la preferencia: ', error);
            throw new Error('Error al eliminar la preferencia');
        }
    }
}

module.exports = PreferencesModel;