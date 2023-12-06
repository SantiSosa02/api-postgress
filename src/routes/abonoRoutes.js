const express = require('express');
const router = express.Router();
const PaymentController = require ('../controllers/abonoController');
const verificarToken = require('../middleware/verificar-token');

// Ruta para obtener todos los usuarios
router.get('/abonos',verificarToken, PaymentController.getAllPayments);
router.get('/abonos/:id',verificarToken, PaymentController.getPaymentById);
router.post('/abonos',verificarToken, PaymentController.createPayment);
router.put('/abonos/:id',verificarToken, PaymentController.updatePaymentState)
router.get('/abonos-activos',verificarToken, PaymentController.getActivePayments);
router.get('/abonos-inactivos',verificarToken, PaymentController.getInactivePayments);
router.get('/abonos-buscar',verificarToken, PaymentController.searchPayment);
router.get('/abonos-venta/:idventa', PaymentController.getPaymentsByVentaId);


module.exports = router;
