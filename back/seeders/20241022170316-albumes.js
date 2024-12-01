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
    await queryInterface.bulkInsert(process.env.TABLA_ALBUM, [
      {
        titulo: 'Viaje Nocturno',
        artista_id: 1,
        fecha_lanzamiento: new Date('2020-01-01'),
        likes: 3891,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Ecos del Mar',
        artista_id: 2,
        fecha_lanzamiento: new Date('2019-06-15'),
        likes: 6959,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Luz de Luna',
        artista_id: 1,
        fecha_lanzamiento: new Date('2021-03-12'),
        likes: 9745,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Caminos Infinitos',
        artista_id: 3,
        fecha_lanzamiento: new Date('2018-10-08'),
        likes: 1234,
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
    await queryInterface.bulkDelete(process.env.TABLA_ALBUM, null, {});
  }
};
