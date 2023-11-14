const express = require('express');
const router = express.Router();
const SaleController = require ('../controllers/ventaController');

// Ruta para obtener todos los usuarios
router.get('/ventas', SaleController.getAllSales);
router.get('/ventas/:id', SaleController.getSaleById);
router.post('/ventas', SaleController.createSale);
router.put('/ventas/estado/:id', SaleController.updateSaleState);
router.get('/ventas-activas', SaleController.getActiveSales);
router.get('/ventas-inactivas', SaleController.getInactiveSales);
router.get('/ventas-buscar', SaleController.searchSale);
router.get('/ventas/abonos-relacionados/:id', SaleController.abonosRelacionados);


module.exports = router;
