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
            const preferences = await models.Preferences.findAll({
                include: [{
                    model: models.PreferenceEntities,
                }]
            });
            return preferences;
        } catch (error) {
            console.error('Error al obtener las preferencias: ', error);
            throw error;
        }
    }

    async getPreferenceById(id) {
        try {
            const preference = await models.Preferences.findByPk(id, {
                include: [{
                    model: models.PreferenceEntities,
                }]
            });
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
                },
                include: [{
                    model: models.PreferenceEntities,
                }]
            });

            if (existingPreference) {

                await models.PreferenceEntities.create({
                    preference_id: existingPreference.id,
                    entidad_id: preferenceData.entidad_id,
                    entidad_tipo: preferenceData.entidad_tipo
                });
                return existingPreference;
            }

            const newPreference = await models.Preferences.create({
                usuario_id: preferenceData.usuario_id,
                entidad_tipo: preferenceData.entidad_tipo
            });

            await models.PreferenceEntities.create({
                preference_id: newPreference.id,
                entidad_id: preferenceData.entidad_id,
                entidad_tipo: preferenceData.entidad_tipo
            });

            return newPreference;
        } catch (error) {
            console.error('Error al crear la preferencia: ', error);
            throw error;
        }
    }

    async updatePreference(id, updatedData) {
        try {
            const preference = await models.Preferences.findByPk(id, {
                include: [{
                    model: models.PreferenceEntities,
                }]
            });
            if (!preference) {
                throw new Error('Preferencia no encontrada');
            }

            if (updatedData.entidad_id && updatedData.entidad_id.length > 3) {
                throw new Error('No se pueden tener más de 3 entidades en una preferencia');
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