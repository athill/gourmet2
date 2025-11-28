'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable('Ingredients',
      {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        amount: { type: Sequelize.STRING },
        unit: { type: Sequelize.STRING },
        item: { type: Sequelize.STRING, allowNull: false },
        key: { type: Sequelize.STRING, allowNull: false },
        optional: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
        recipeId: { type: Sequelize.INTEGER, allowNull: false },

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


      });

  },

  async down (queryInterface, Sequelize) {

     await queryInterface.dropTable('Ingredients');
  }
};
