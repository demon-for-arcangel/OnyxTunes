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
   await queryInterface.bulkInsert(process.env.TABLA_CANCION_ALBUM, 
    { 
      cancion_id: 1, 
      album_id: 1, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    },
    { 
      cancion_id: 2, 
      album_id: 1, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    },
    { 
      cancion_id: 3, 
      album_id: 2, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    },
    {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(process.env.TABLA_CANCION_ALBUM, null, {});
  }
};
