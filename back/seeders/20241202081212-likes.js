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
    await queryInterface.bulkInsert(process.env.TABLA_LIKE, [
      {
        usuario_id: 1,
        entidad_id: 1, 
        entidad_tipo: 'Cancion',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        usuario_id: 2,
        entidad_id: 1, 
        entidad_tipo: 'Playlist',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        usuario_id: 3,
        entidad_id: 1, 
        entidad_tipo: 'Album',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        usuario_id: 1,
        entidad_id: 3, 
        entidad_tipo: 'Cancion',
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
    await queryInterface.bulkDelete(process.env.TABLA_LIKE, null, {});
  }
};
