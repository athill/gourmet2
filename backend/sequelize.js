import path from 'path';
import {config} from 'dotenv'
config({
  path: path.resolve(process.cwd(), './backend/.env'),
  quiet: true,
});

import { Sequelize }  from 'sequelize';

console.log('Initializing Sequelize with database URL:', process.env.DATABASE_URL);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DATABASE_URL || 'database.sqlite',
});


export default sequelize;
