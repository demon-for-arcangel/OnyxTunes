'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cancions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_album: {
        type: Sequelize.INTEGER
      },
      id_artista: {
        type: Sequelize.INTEGER
      },
      titulo: {
        type: Sequelize.STRING
      },
      duracion: {
        type: Sequelize.TIME
      },
      archivo_audio: {
        type: Sequelize.STRING
      },
      reproducciones: {
        type: Sequelize.INTEGER
      },
      fecha_subida: {
        type: Sequelize.DATE
      },
      genero: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Cancions');
  }
};