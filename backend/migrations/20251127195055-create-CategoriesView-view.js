'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {

     await queryInterface.sequelize.query(`
      CREATE VIEW IF NOT EXISTS CategoriesView AS
        SELECT

          DISTINCT Recipes.category
        FROM Recipes
        ORDER BY Recipes.category ASC
      `);
  },

  async down (queryInterface, Sequelize) {

     await queryInterface.sequelize.query(`DROP VIEW IF EXISTS CategoriesView`);
  }
};
