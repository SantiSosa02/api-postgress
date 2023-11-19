const express = require('express');
const router = express.Router();
const ClientController = require ('../controllers/clienteController');
const verificarToken = require('../middleware/verificar-token');


// Ruta para obtener todos los usuarios
router.get('/clientes',verificarToken, ClientController.getAllClients);
router.get('/clientes/:id',verificarToken, ClientController.getClientById);
router.post('/clientes', verificarToken,ClientController.createClient);
router.put('/clientes/:id', verificarToken,ClientController.updateClient);
router.put('/clientes/estado/:id',verificarToken, ClientController.updateClientState);
router.delete('/clientes/:id',verificarToken, ClientController.deleteClient);
router.get('/clientes-activos',verificarToken, ClientController.getActiveClients);
router.get('/clientes-inactivos',verificarToken, ClientController.getInactiveClients);
router.get('/clientes-buscar', verificarToken,ClientController.searchClient);
router.get('/clientes-correo', verificarToken,ClientController.verificarCorreoExistente);
router.get('/clientes-telefono', verificarToken,ClientController.verificarTelefonoExistente);

module.exports = router;
