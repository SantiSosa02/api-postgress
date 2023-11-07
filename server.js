const express = require('express');
const cors = require ('cors');
const sequelize = require('./src/config/sequelize');
const userRoutes = require('./src/routes/usuarioRoutes');
const clientRoutes = require('./src/routes/clienteRoutes')
const categoryRoutes = require('./src/routes/categoriaRoutes')
const serviceRoutes = require('./src/routes/servicioRoutes')
const productRoutes = require ('./src/routes/productoRoutes')
const saleRoutes = require ('./src/routes/ventaRoutes')
const paymetRoutes = require( './src/routes/abonoRoutes')

const app = express();  
app.use(cors());

const PORT = process.env.PORT || 8080;
app.use(express.json());  

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Successfully connected to PostgreSQL');
  } catch (error) {
    console.error('Unable to connect to PostgreSQL:', error);
  }
})(); 

app.use('/api', userRoutes);
app.use('/api', clientRoutes);
app.use('/api', categoryRoutes);
app.use('/api', serviceRoutes);
app.use('/api', productRoutes);
app.use('/api', saleRoutes);
app.use ('/api', paymetRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
