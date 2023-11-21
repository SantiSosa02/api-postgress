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


const sequelize = new Sequelize('visor_bd', 'visor_bd_user', '19kz1bdJrIrlNZLK4HkCTuBW3ozccmUA', {
  host: 'dpg-clejrots40us73d1fq70-a.ohio-postgres.render.com',
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true, // Habilita SSL/TLS
    },
  },
});


module.exports = sequelize;

