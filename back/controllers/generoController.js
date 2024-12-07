const { response, request } = require("express");
const Conexion = require("../database/GeneroConnection");
const models = require('../models');

const conx = new Conexion();

const getGeneros = async (req, res) => {
    try {
        const generos = await conx.indexGeneros();
        res.status(200).json(generos);
    } catch (error) {
        console.log('Error al obtener los géneros', error);
        res.status(500).json({ msg: "Error al obtener los géneros" });
    }
};

const getGeneroById = async (req, res) => {
    const generoId = req.params.id;

    try {
        const genero = await conx.getGeneroById(generoId);

        if (!genero) {
            return res.status(404).json({ msg: "Género no encontrado" });
        }

        res.status(200).json(genero);
    } catch (error) {
        console.error('Error al obtener el género:', error);
        res.status(500).json({ msg: "Error al obtener el género" });
    }
};

const createGenero = async (req, res) => {
    const { nombre } = req.body;

    try {
        const newGenero = await conx.createGenero({ nombre });
        res.status(201).json({ msg: "Género creado con éxito", genero: newGenero });
    } catch (error) {
        console.error('Error al crear el género:', error);
        res.status(500).json({ msg: "Error al crear el género" });
    }
};

const updateGenero = async (req, res) => {
    const generoId = req.params.id;
    const updatedData = req.body;

    try {
        const updatedGenero = await conx.updateGenero(generoId, updatedData);
        if (!updatedGenero) {
            return res.status(404).json({ msg: "Género no encontrado" });
        }
        res.status(200).json({ msg: "Género actualizado con éxito", genero: updatedGenero });
    } catch (error) {
        console.error('Error al actualizar el género:', error);
        res.status(500).json({ msg: "Error al actualizar el género" });
    }
};

const deleteGeneros = async (req, res) => {
    const { generosIds } = req.body;

    try {
        if (!Array.isArray(generosIds) || generosIds.length === 0) {
            return res.status(400).json({ msg: "No se proporcionaron IDs de géneros para eliminar." });
        }

        const result = await generoConnection.deleteGeneros(generosIds);

        res.status(200).json({ 
            msg: `${result} géneros eliminados exitosamente.` 
        });
    } catch (error) {
        console.error("Error al eliminar los géneros:", error);
        res.status(500).json({ msg: "Error al eliminar los géneros." });
    }
};

module.exports = {
    getGeneros, getGeneroById, createGenero, updateGenero, deleteGeneros
};
