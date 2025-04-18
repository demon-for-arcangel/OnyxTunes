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
        password: await bcrypt.hash('1234', 10),
        nickname: 'adminPro',
        fecha_nacimiento: null,
        foto_perfil: '',
        telefono: '',
        genero: 'Femenino',
        activo: 1,
        last_login: new Date(),
        connected: 1,
        rol: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: 'artista',
        email: 'artista@onyxtunes.com',
        password: await bcrypt.hash('1234', 10),
        nickname: 'Kratos33',
        fecha_nacimiento: '1990-01-01',
        foto_perfil: '',
        telefono: '',
        genero: 'Otro',
        activo: 1,
        last_login: new Date(),
        connected: 1,
        rol: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: 'usuario',
        email: 'usuario@onyxtunes.com',
        password: await bcrypt.hash('1234', 10),
        nickname: 'bfgbfg',
        fecha_nacimiento: null,
        foto_perfil: '',
        telefono: '',
        genero: 'Masculino',
        activo: 1,
        last_login: new Date(),
        connected: 1,
        rol: 3,
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