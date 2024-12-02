'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(process.env.TABLA_GENERO, [
      {
        nombre: 'Pop',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Rock',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Hip Hop',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Jazz',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Clásica',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Electrónica',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Reggae',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Blues',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Folk',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Metal',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(process.env.TABLA_GENERO, null, {});
  }
};
