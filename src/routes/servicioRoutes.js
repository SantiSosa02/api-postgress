const express = require('express');
const router = express.Router();
const ServiceController = require ('../controllers/servicioController');

// Ruta para obtener todos los usuarios
router.get('/servicios', ServiceController.getAllServices);
router.get('/servicios/:id', ServiceController.getServiceById);
router.post('/servicios', ServiceController.createService);
router.put('/servicios/:id', ServiceController.updateService);
router.put('/servicios/estado/:id', ServiceController.updateServiceState);
router.delete('/servicios/:id', ServiceController.deleteService)
router.get('/servicios-activos', ServiceController.getActiveServices);
router.get('/servicios-inactivos', ServiceController.getInactiveServices);
router.get('/servicios-buscar', ServiceController.searchService);
router.get('/servicios-nombre', ServiceController.verificarNombreExistente);

module.exports = router;
