import sequelize from "../sequelize.js";
import Ingredient from "./Ingredient.js";
import { DataTypes } from 'sequelize';

const Recipe = sequelize.define('Recipe', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cuisine: {
    type: DataTypes.STRING,
    allowNull: false
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rating: {
    type: DataTypes.STRING,
    allowNull: false
  },
  preptime: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cooktime: {
    type: DataTypes.STRING,
    allowNull: false
  },
  yields: {
    type: DataTypes.STRING,
    allowNull: false
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: false
  }
  // Model attributes are defined here
});

Recipe.hasMany(Ingredient, { as: 'ingredients', foreignKey: 'recipeId' });
Ingredient.belongsTo(Recipe, { foreignKey: 'recipeId', as: 'recipe' });

Recipe.sync();

export default Recipe;
