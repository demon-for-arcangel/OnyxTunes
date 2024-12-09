const { response, request } = require("express");
const Conexion = require("../../database/user/ProfileConnection");
const bcrypt = require("bcrypt");
/* const { generateRandPass } = require("../../helpers/generatePass");
 */const models = require('../../models');
/* const nodemailer = require('nodemailer');
 */const jwt = require('jsonwebtoken');

const conx = new Conexion();

const getPlaylistPublics = async (req, res) => {
    try {
        const userId = req.params.userId; 

        const publicPlaylists = await conx.getPlaylistPublics(userId); // Pasa el userId a la función del modelo
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