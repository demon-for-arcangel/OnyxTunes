'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('seguidores_relaciones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      seguidor_id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: process.env.TABLA_USUARIO
          }, 
          key: 'id'
        },
      },
      seguido_id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: process.env.TABLA_USUARIO
          }, 
          key: 'id'
        },
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('seguidores_relaciones');
  }
};