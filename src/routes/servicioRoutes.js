const express = require('express');
const router = express.Router();
const ServiceController = require ('../controllers/servicioController');
const verificarToken = require('../middleware/verificar-token');


// Ruta para obtener todos los usuarios
router.get('/servicios',verificarToken, ServiceController.getAllServices);
router.get('/servicios/:id',verificarToken, ServiceController.getServiceById);
router.post('/servicios',verificarToken, ServiceController.createService);
router.put('/servicios/:id', verificarToken,ServiceController.updateService);
router.put('/servicios/estado/:id',verificarToken, ServiceController.updateServiceState);
router.delete('/servicios/:id',verificarToken, ServiceController.deleteService)
router.get('/servicios-activos',verificarToken, ServiceController.getActiveServices);
router.get('/servicios-inactivos',verificarToken, ServiceController.getInactiveServices);
router.get('/servicios-buscar',verificarToken, ServiceController.searchService);
router.get('/servicios-nombre', verificarToken,ServiceController.verificarNombreExistente);

module.exports = router;
