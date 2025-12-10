import sequelize from "../sequelize.js";
import Ingredient from "./Ingredient.js";
import { DataTypes } from 'sequelize';
import { Model } from 'sequelize';

class Recipe extends Model {}

Recipe.init(
  {
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
    },
    rating: {
      type: DataTypes.NUMBER,
    },
    preptime: {
      type: DataTypes.STRING,
    },
    cooktime: {
      type: DataTypes.STRING,
    },
    yieldsQuantity: {
      field: 'yields_quantity',
      type: DataTypes.FLOAT,
    },
    yieldsUnit: {
      field: 'yields_unit',
      type: DataTypes.STRING,
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.BLOB,
    },
    imageType: {
      field: 'image_type',
      type: DataTypes.STRING,
    }
    // Model attributes are defined here
  },
  { sequelize }
);

export default Recipe;
