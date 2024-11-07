'use strict';

const { usuarioRolFactory } = require('../factories/usuarioRolFactory');
const models = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      const adminUser = await models.Usuario.findOne({ where: { email: 'admin@onyxtunes.com' }});
      const artistUser = await models.Usuario.findOne({where: { email: 'artista@onyxtunes.com' }});
      const user = await models.Usuario.findOne({ where: { email: 'usuario@onyxtunes.com' }});

      const adminRol = await models.Rol.findOne({ where: { nombre: 'Administrador' }});
      const artistaRol = await models.Rol.findOne({ where: { nombre: 'Artista' }});
      const userRol = await models.Rol.findOne({ where: { nombre: 'Usuario' }});

      if (adminUser && adminRol) {
        await adminUser.setRoles(adminRol);
      }

      if (user && userRol) {
        await user.setRoles(userRol);
      }

      if (artistUser && artistaRol) {
        await artistUser.setRoles(artistaRol);
      }

    } catch(error) {
      console.error(error);
    }

    let factoryUserRols = await usuarioRolFactory(5);
    await queryInterface.bulkInsert(process.env.TABLA_ROL_USUARIO, factoryUserRols);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(process.env.TABLA_ROL_USUARIO, null, {});
  }
};
