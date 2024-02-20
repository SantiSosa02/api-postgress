// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('bd_visor', 'postgres', 'dalmata56', {
//   host: 'localhost',
//   dialect: 'postgres',
// });

// module.exports = sequelize;


// const { Sequelize } = require('sequelize');


// const sequelize = new Sequelize('bd_visor', 'uservisor', '7qVITZQdinLawMDyFY3dchjapqhvyK5P', {
//   host: 'dpg-cl5b2r28vr0c739tpmn0-a.ohio-postgres.render.com',
//   dialect: 'postgres',
//   dialectOptions: {
//     ssl: {
//       require: true, // Habilita SSL/TLS
//     },
//   },
// });


// module.exports = sequelize;


const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('visor_datos', 'visor_user', 'TalScyAmOD8z3SI0AmmjXU3GnpBJJPHK', {
  host: 'dpg-cnaektda73kc73emrkdg-a.ohio-postgres.render.com',
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true, // Habilita SSL/TLS
    },
  },
});


module.exports = sequelize;

