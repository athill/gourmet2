import Recipe from './models/Recipe.js'; // to ensure models are loaded
import Ingredient from './models/Ingredient.js';

const initializeDatabase = (sequelize) => {
  // create views
  // sequelize.query(`
  //   CREATE VIEW IF NOT EXISTS CategoriesView AS
  //   SELECT

  //     DISTINCT Recipes.category
  //   FROM Recipes
  //   ORDER BY Recipes.category ASC
  // `);

  // sequelize.query(`
  //   CREATE VIEW IF NOT EXISTS CuisinesView AS
  //   SELECT

  //     DISTINCT Recipes.cuisine
  //   FROM Recipes
  //   ORDER BY Recipes.cuisine ASC
  // `);

  // Relationships
  Recipe.hasMany(Ingredient, { as: 'ingredients', foreignKey: 'recipeId' });
  Ingredient.belongsTo(Recipe, { foreignKey: 'recipeId', as: 'recipe' });

  // Sync models
  // Recipe.sync();
  // Ingredient.sync();
};

export default initializeDatabase;
