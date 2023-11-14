const express = require('express');
const router = express.Router();
const UserController = require ('../controllers/usuarioController');

// Ruta para obtener todos los usuarios
router.get('/usuarios', UserController.getAllUsers);
router.get('/usuarios/:id', UserController.getUserById);
router.post('/usuarios', UserController.createUser);
router.put('/usuarios/:id', UserController.updateUser);
router.put('/usuarios/estado/:id', UserController.updateUserState);
router.delete('/usuarios/:id', UserController.deleteUser)
router.post('/usuarios/login' , UserController.loginUser);
router.post('/usuarios/recuperar', UserController.forgotPassword);
router.post('/cambiar-contrasena/:token', UserController.changePassword);
router.get('/usuarios-activos', UserController.getActiveUsers);
router.get('/usuarios-inactivos', UserController.getInactiveUsers);
router.get('/usuarios-buscar', UserController.searchUser);
router.get('/usuarios-correo', UserController.verificarCorreoExistente);


module.exports = router;



