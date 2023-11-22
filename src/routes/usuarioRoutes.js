const express = require('express');
const router = express.Router();
const UserController = require ('../controllers/usuarioController');
const verificarToken = require('../middleware/verificar-token');

// Ruta para obtener todos los usuarios
router.get('/usuarios', verificarToken,UserController.getAllUsers);
router.get('/usuarios/:id', verificarToken,UserController.getUserById);
router.post('/usuarios',verificarToken,UserController.createUser);
router.put('/usuarios/:id',verificarToken, UserController.updateUser);
router.put('/usuarios/estado/:id',verificarToken, UserController.updateUserState);
router.delete('/usuarios/:id',verificarToken, UserController.deleteUser)
router.post('/usuarios/login' , UserController.loginUser);
router.post('/usuarios/recuperar',UserController.forgotPassword);
router.post('/cambiar-contrasena/:token',UserController.changePassword);
router.get('/usuarios-activos', verificarToken,UserController.getActiveUsers);
router.get('/usuarios-inactivos', verificarToken,UserController.getInactiveUsers);
router.get('/usuarios-buscar', verificarToken,UserController.searchUser);
router.get('/usuarios-correo',verificarToken, UserController.verificarCorreoExistente);


module.exports = router;



