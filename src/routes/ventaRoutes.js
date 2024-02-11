const express = require('express');
const router = express.Router();
const SaleController = require ('../controllers/ventaController');
const verificarToken = require('../middleware/verificar-token');


// Ruta para obtener todos los usuarios
router.get('/ventas',verificarToken, SaleController.getAllSales);
router.get('/ventas/:id', verificarToken,SaleController.getSaleById);
router.post('/ventas',verificarToken, SaleController.createSale);
router.put('/ventas/estado/:id', verificarToken,SaleController.updateSaleState);
router.get('/ventas-activas',verificarToken, SaleController.getActiveSales);
router.get('/ventas-inactivas',verificarToken, SaleController.getInactiveSales);
router.get('/ventas-buscar',verificarToken, SaleController.searchSale);
router.get('/ventas/abonos-relacionados/:id', verificarToken,SaleController.abonosRelacionados);
router.post('/ventas/observacion/:id', verificarToken,SaleController.guardarObservacionVenta);



module.exports = router;
