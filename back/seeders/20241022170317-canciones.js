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
   await queryInterface.bulkInsert(process.env.TABLA_CANCION, [
    {
      titulo: 'Luz de Luna',
      duracion: 120,
      likes: 20,
      reproducciones: 30,
      album_id: 1,    
      artista_id: 1,  
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      titulo: 'Caminos Infinitos',
      duracion: 200,
      likes: 666,
      reproducciones: 7321,
      album_id: 1,    
      artista_id: 2,  
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      titulo: 'Ecos de Ayer',
      duracion: 260,
      likes: 12500,
      reproducciones: 18000,
      album_id: 2,    
      artista_id: 1,  
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      titulo: 'Sueños Perdidos',
      duracion: 243,
      likes: 9900,
      reproducciones: 11855,
      album_id: 2,    
      artista_id: 2,  
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
    await queryInterface.bulkDelete(process.env.TABLA_CANCION, null, {})
  }
};
