import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('maru3', 'root', 'a123', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3308,
  logging: false,
});

export default sequelize;
