const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('bd_visor', 'postgres', 'dalmata56', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
