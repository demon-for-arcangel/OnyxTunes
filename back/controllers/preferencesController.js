const { response, request } = require("express");
const preferences = require("../database/preferencesConnection");

const conx = new preferences();

/**
 * Controlador de Preferencias
 * @function getPreferences Obtener las preferencias
 * @function getPreferenceById Obtener una preferencia por su id
 * @function createPreference Crear una preferencia
 * @function updatePreference Actualizar una preferencia
 * @function deletePreference Eliminar una preferencia
 */
const getPreferences = async (req, res) => {
  try {
    const preferences = await conx.indexPreferences();
    res.status(200).json(preferences);
  } catch (error) {
    console.error("Error al obtener las preferencias:", error);
    res.status(500).json({ msg: "Error al obtener las preferencias." });
  }
};

const getPreferenceById = async (req, res) => {
  const preferenceId = req.params.id;

  try {
    const preference = await conx.getPreferenceById(preferenceId);

    if (!preference) {
      return res.status(404).json({ msg: "Preferencia no encontrada" });
    }

    res.status(200).json(preference);
  } catch (error) {
    console.error('Error al obtener la preferencia:', error);
    res.status(500).json({ msg: "Error al obtener la preferencia" });
  }
};

const createPreference = async (req, res) => {
  const { usuario_id, entidad_id, entidad_tipo } = req.body;

  try {
    const newPreference = await conx.createPreference({ usuario_id, entidad_id, entidad_tipo });
    res.status(201).json({ msg: "Preferencia creada con éxito", preference: newPreference });
  } catch (error) {
    console.error('Error al crear la preferencia:', error);
    if (error.message === 'El usuario ya tiene el máximo de preferencias de este tipo') {
      res.status(400).json({ msg: error.message });
    } else {
      res.status(500).json({ msg: "Error al crear la preferencia" });
    }
  }
};

const updatePreference = async (req, res) => {
  const preferenceId = req.params.id;
  const updatedData = req.body;

  try {
    const updatedPreference = await conx.updatePreference(preferenceId, updatedData);
    if (!updatedPreference) {
      return res.status(404).json({ msg: "Preferencia no encontrada" });
    }
    res.status(200).json({ msg: "Preferencia actualizada con éxito", preference: updatedPreference });
  } catch (error) {
    console.error('Error al actualizar la preferencia:', error);
    if (error.message === 'No se pueden tener más de 3 entidades en una preferencia') {
      res.status(400).json({ msg: error.message });
    } else {
      res.status(500).json({ msg: "Error al actualizar la preferencia" });
    }
  }
};

const deletePreference = async (req, res) => {
  const preferenceId = req.params.id;

  try {
    const result = await conx.deletePreference(preferenceId);
    if (!result) {
      return res.status(404).json({ msg: "Preferencia no encontrada" });
    }
    res.status(200).json({ msg: "Preferencia eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar la preferencia:", error);
    res.status(500).json({ msg: "Error al eliminar la preferencia" });
  }
};

module.exports = {
  getPreferences,
  getPreferenceById,
  createPreference,
  updatePreference,
  deletePreference
};