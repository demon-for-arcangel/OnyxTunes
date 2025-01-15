'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(process.env.TABLA_PREFERENCES_ENTIDADES, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      preference_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: process.env.TABLA_PREFERENCES
          },
          key: 'id',
        }
      },
      entidad_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      entidad_tipo: {
        type: Sequelize.ENUM('Artista', 'Genero'),
        allowNull: false,
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
    await queryInterface.dropTable(process.env.TABLA_PREFERENCES_ENTIDADES);
  }
};