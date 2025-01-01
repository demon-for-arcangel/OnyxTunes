require("dotenv").config();
const { Sequelize, Op } = require("sequelize");
const models = require("../../models");
const Conexion = require("../connection.js");
const bcrypt = require('bcrypt');

const conexion = new Conexion();

/**
 * Conexion de Perfil
 * @function getPlaylistPublics Obtener las playlists publicas de un usuario
 */
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
                        attributes: [] 
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