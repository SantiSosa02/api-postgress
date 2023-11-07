const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('bdVisor', 'postgres', 'dalmata56.', {
//   host: 'visorbasedatos.c9vpbtfrlvpo.us-east-2.rds.amazonaws.com',
//   dialect: 'postgres',
// });

const sequelize = new Sequelize('bd_visor', 'uservisor', '7qVITZQdinLawMDyFY3dchjapqhvyK5P', {
  host: 'dpg-cl5b2r28vr0c739tpmn0-a.ohio-postgres.render.com',
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true, // Habilita SSL/TLS
    },
  },
});


module.exports = sequelize;
