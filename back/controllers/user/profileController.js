const { response, request } = require("express");
const Conexion = require("../../database/user/ProfileConnection");
const bcrypt = require("bcrypt");
/* const { generateRandPass } = require("../../helpers/generatePass");
 */const models = require('../../models');
/* const nodemailer = require('nodemailer');
 */const jwt = require('jsonwebtoken');

const conx = new Conexion();

/**
 * Controlador para obtener las playlists publicas de un usuario
 * @function getPlaylistPublics Obtener las playlists publicas de un usuario
 */
const getPlaylistPublics = async (req, res) => {
    try {
        const userId = req.params.userId; 

        const publicPlaylists = await conx.getPlaylistPublics(userId);
        return res.status(200).json({
            success: true,
            data: publicPlaylists
        });
    } catch (error) {
        console.error("Error al obtener las playlists públicas:", error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener las playlists públicas"
        });
    }
}

module.exports = {
    getPlaylistPublics
}