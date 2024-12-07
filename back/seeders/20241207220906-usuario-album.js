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

    await queryInterface.bulkInsert(process.env.TABLA_USUARIO_ALBUM, [
      {
          usuario_id: 2, 
          album_id: 1,   
          createdAt: new Date(),
          updatedAt: new Date()
      },
      {
          usuario_id: 2, 
          album_id: 2,   
          createdAt: new Date(),
          updatedAt: new Date()
      },
      {
        usuario_id: 3, 
        album_id: 3,   
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        usuario_id: 3, 
        album_id: 4,   
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
    await queryInterface.bulkDelete(process.env.TABLA_USUARIO_ALBUM, null, {});
  }
};
