'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert(process.env.TABLA_ROL, [
    {
      nombre: 'Administrador',
      descripcion: 'Este usuario es el administrador del sistema',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      nombre: 'Artista',
      descripcion: 'El artista serán cantantes, grupos, compositores de música',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      nombre: 'Usuario',
      descripcion: 'Usuario normal de la plataforma',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
   ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(process.env.TABLA_ROL, null, {})
  }
};
