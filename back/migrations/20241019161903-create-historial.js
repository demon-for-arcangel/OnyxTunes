'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(process.env.TABLA_HISTORIAL, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      usuario_id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: process.env.TABLA_USUARIO
          },
          key: 'id'
        }
      },
      cancion_id: {
        type: Sequelize.INTEGER
      },
      fecha_reproduccion: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable(process.env.TABLA_HISTORIAL);
  }
};