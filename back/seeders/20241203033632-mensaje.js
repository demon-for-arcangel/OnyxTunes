'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert(process.env.TABLA_MENSAJE, [
      {
        emisor: 1, // ID del usuario emisor
        receptor: 2, // ID del usuario receptor
        texto: 'Hola, ¿cómo estás?',
        leido: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        emisor: 2,
        receptor: 1,
        texto: '¡Hola! Estoy bien, gracias. ¿Y tú?',
        leido: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        emisor: 1,
        receptor: 2,
        texto: 'Todo bien, gracias por preguntar.',
        leido: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        emisor: 2,
        receptor: 1,
        texto: '¿Te gustaría salir a tomar un café?',
        leido: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        emisor: 1,
        receptor: 2,
        texto: '¡Claro! Me encantaría.',
        leido: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(process.env.TABLA_MENSAJE, null, {});
  }
};
