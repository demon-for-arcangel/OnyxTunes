require("dotenv").config();
const { Sequelize, Op } = require("sequelize");
const models = require("../models");
const Conexion = require("./connection.js");

const conexion = new Conexion();

class AlbumModel {
    constructor() {}

    async indexAlbums() {
        try {
            const albums = await models.Album.findAll();
            return albums;
        } catch (error) {
            console.error('Error al mostrar la lista de los Albums: ', error);
            throw new Error('Error al mostrar la lista de albums');
        }
    }

    async getAlbumById(id) {
        try {
            const album = await models.Album. findByPK(id);
            if (!album) {
                throw new Error('Album no encontrado');
            }
            return album;
        } catch (error) {
            console.error('Error al mostrar el album: ', error);
            throw new Error('Error al mostrar el album');
        }
    }

    async createAlbum(titulo, artista_id){
        try {
            const newAlbum = await models.Album.create({
                titulo,
                artista_id
            })

            return newAlbum;
        } catch (error) {
            console.error('Error al crear el album: ', error);
            throw new Error('Error al crear el album.')
        }
    }

    async updateAlbum(albumId, newData) {
        try {
            const album = await models.Album.findByPK(albumId);
            if (!album) {
                throw new Error('Album no encontrado');
            }
            const updatedAlbum = await album.update(newData);
            return updatedAlbum;
        } catch (error) {
            console.error('Error al actualizar el album', error);
            throw new Error('Error al actualizar el album');
        }
    }

    async deleteAlbum(albumsIds) {
        
    }
}

module.exports = AlbumModel;