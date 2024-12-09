require("dotenv").config();
const { Sequelize, Op } = require("sequelize");
const models = require("../../models");
const Conexion = require("../connection.js");
const bcrypt = require('bcrypt');

const conexion = new Conexion();

class ProfileModel {
    async getPlaylistPublics(userId) {
        try {
            const publicPlaylists = await models.Playlist.findAll({
                where: {
                    publico: true 
                },
                attributes: {
                    exclude: ['usuario_id']
                },
                include: [{
                    model: models.Usuario,
                    through: {
                        model: models.UsuarioPlaylist,
                        attributes: [] // No necesitamos atributos de la tabla intermedia
                    },
                }]
            });
            return publicPlaylists;
        } catch (error) {
            console.error("Error al obtener las playlists públicas:", error);
            throw new Error("Error al obtener las playlists públicas");
        }
    }
}

module.exports = ProfileModel;