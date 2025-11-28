import { DataTypes, Model } from 'sequelize';

import sequelize from '../sequelize.js';

class CategoriesView extends Model {}

CategoriesView.init(
  {
    category: {
      type: DataTypes.STRING,
      primaryKey: true
    }
  },
  { sequelize, tableName: 'CategoriesView', timestamps: false }
);

export default CategoriesView;
