'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(process.env.TABLA_GENERO_CANCION, [
      {
        cancion_id: 1, 
        genero_id: 1,   
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        cancion_id: 1,
        genero_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        cancion_id: 2,
        genero_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        cancion_id: 2,
        genero_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        cancion_id: 3,
        genero_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        cancion_id: 3,
        genero_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(process.env.TABLA_GENERO_CANCION, null, {});
  }
};
