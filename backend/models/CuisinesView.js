import { DataTypes, Model } from 'sequelize';

import sequelize from '../sequelize.js';

class CuisinesView extends Model {}

CuisinesView.init(
  {
    cuisine: {
      type: DataTypes.STRING,
      primaryKey: true
    }
  },
  { sequelize, tableName: 'CuisinesView', timestamps: false }
);

export default CuisinesView;
