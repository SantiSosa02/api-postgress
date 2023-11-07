const express = require('express');
const router = express.Router();
const ClientController = require ('../controllers/clienteController');

// Ruta para obtener todos los usuarios
router.get('/clientes', ClientController.getAllClients);
router.get('/clientes/:id', ClientController.getClientById);
router.post('/clientes', ClientController.createClient);
router.put('/clientes/:id', ClientController.updateClient);
router.put('/clientes/estado/:id', ClientController.updateClientState);
router.delete('/clientes/:id', ClientController.deleteClient);
router.get('/clientes-activos', ClientController.getActiveClients);
router.get('/clientes-inactivos', ClientController.getInactiveClients);
router.get('/clientes-buscar', ClientController.searchClient);
router.get('/clientes-correo', ClientController.verificarCorreoExistente);
router.get('/clientes-telefono', ClientController.verificarTelefonoExistente);

module.exports = router;
