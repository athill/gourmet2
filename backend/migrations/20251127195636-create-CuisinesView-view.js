'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
      await queryInterface.sequelize.query(`
      CREATE VIEW IF NOT EXISTS CuisinesView AS
        SELECT

          DISTINCT Recipes.cuisine
        FROM Recipes
        ORDER BY Recipes.cuisine ASC
      `);
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.sequelize.query(`DROP VIEW IF EXISTS CuisinesView`);
  }
};
