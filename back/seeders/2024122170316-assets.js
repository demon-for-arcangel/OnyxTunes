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
    await queryInterface.bulkInsert(process.env.TABLA_ASSET, [
      {
        id: 1,
        path: 'public/song1.mp3', 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        path: 'public/song2.mp3', 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        path: 'public/song3.mp3',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(process.env.TABLA_ASSET, null, {});
  }
};
