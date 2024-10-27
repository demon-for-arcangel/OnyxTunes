'use strict';

const { QueryInterface } = require('sequelize');
const { userFactory } = require('../factories/userFactory');
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(process.env.TABLA_USUARIO, [
      {
        nombre: 'admin',
        email: 'admin@onyxtunes.com',
        password: '1234',
        fecha_nacimiento: null,
        foto_perfil: '',
        direccion: '',
        telefono: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: 'artista',
        email: 'artista@onyxtunes.com',
        password: '1234',
        fecha_nacimiento: '1990-01-01',
        foto_perfil: '',
        direccion: '',
        telefono: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: 'usuario',
        email: 'usuario@onyxtunes.com',
        password: '1234',
        fecha_nacimiento: null,
        foto_perfil: '',
        direccion: '',
        telefono: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});

    let factoryUser = await userFactory(20)
    await queryInterface.bulkInsert(process.env.TABLA_USUARIO, factoryUser, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(process.env.TABLA_USUARIO, null, {})
  }
};