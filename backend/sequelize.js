import { Sequelize }  from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DATABASE_URL || 'database.sqlite',
});


export default sequelize;
