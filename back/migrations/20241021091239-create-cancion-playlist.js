'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(process.env.TABLA_CANCION_PLAYLIST, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cancion_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: process.env.TABLA_CANCION
          },
          key: 'id'
        }
      },
      playlist_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: process.env.TABLA_PLAYLIST
          },
          key: 'id'
        }
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
    await queryInterface.dropTable(process.env.TABLA_CANCION_PLAYLIST);
  }
};