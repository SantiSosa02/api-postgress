const express = require('express');
const router = express.Router();
const PaymentController = require ('../controllers/abonoController');

// Ruta para obtener todos los usuarios
router.get('/abonos', PaymentController.getAllPayments);
router.get('/abonos/:id', PaymentController.getPaymentById);
router.post('/abonos', PaymentController.createPayment);
router.put('/abonos/:id', PaymentController.updatePaymentState)
router.get('/abonos-activos', PaymentController.getActivePayments);
router.get('/abonos-inactivos', PaymentController.getInactivePayments);
router.get('/abonos-buscar', PaymentController.searchPayment);

module.exports = router;
