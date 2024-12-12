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
        fecha_lanzamiento: new Date('2020-01-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Ecos del Mar',
        fecha_lanzamiento: new Date('2019-06-15'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Luz de Luna',
        fecha_lanzamiento: new Date('2021-03-12'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Caminos Infinitos',
        fecha_lanzamiento: new Date('2018-10-08'),
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
