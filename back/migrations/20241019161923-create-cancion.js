'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(process.env.TABLA_CANCION, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titulo: {
        type: Sequelize.STRING
      },
      duracion: {
        type: Sequelize.INTEGER
      },
      reproducciones: {
        type: Sequelize.INTEGER
      },
      portadaURL: {
        type: Sequelize.TEXT
      },
      album_id: {
        type: Sequelize.INTEGER,
        allowNull: true, 
        references: {
          model: {
            tableName: process.env.TABLA_ALBUM
          },
          key: 'id'
        }
      },
      artista_id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: process.env.TABLA_USUARIO
          },
          key: 'id'
        }
      },
      assetId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: process.env.TABLA_ASSET
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
    await queryInterface.dropTable(process.env.TABLA_CANCION);
  }
};