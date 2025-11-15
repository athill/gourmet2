import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const Ingredient = sequelize.define('Ingredient', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.STRING,
    allowNull: false
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false
  },
  item: {
    type: DataTypes.STRING,
    allowNull: false
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false
  },
  recipeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
  // Model attributes are defined here
});

Ingredient.sync();

export default Ingredient;
