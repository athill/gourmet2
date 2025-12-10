'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable('Recipes',
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false
        },
        category: {
          type: Sequelize.STRING,
          allowNull: false
        },
        cuisine: {
          type: Sequelize.STRING,
        },
        link: {
          type: Sequelize.STRING,
        },
        rating: {
          type: Sequelize.NUMBER,
        },
        preptime: {
          type: Sequelize.STRING,
        },
        cooktime: {
          type: Sequelize.STRING,
        },
        yields_quantity: {
          type: Sequelize.FLOAT,
        },
        yields_unit: {
          type: Sequelize.STRING,
        },
        instructions: {
          type: Sequelize.TEXT,
        },
        notes: {
          type: Sequelize.TEXT,
        },
        image: {
          type: Sequelize.BLOB,
        },
        image_type: {
          type: Sequelize.STRING,
        },

        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Recipes');
  }
};
