import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';
import { Model } from 'sequelize';

class Ingredient extends Model {}

Ingredient.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.STRING,
    },
    unit: {
      type: DataTypes.STRING,
    },
    item: {
      type: DataTypes.STRING,
      allowNull: false
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    optional: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    recipeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  { sequelize }
  // Model attributes are defined here
);

export default Ingredient;
