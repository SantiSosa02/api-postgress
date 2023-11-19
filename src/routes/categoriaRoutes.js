const express = require('express');
const router = express.Router();
const CategoryController = require ('../controllers/categoriaController');
const verificarToken = require('../middleware/verificar-token');


// Ruta para obtener todos los usuarios
router.get('/categorias',verificarToken, CategoryController.getAllCategories);
router.get('/categorias/:id', verificarToken,CategoryController.getCategoryById);
router.post('/categorias',verificarToken, CategoryController.createCategory);
router.put('/categorias/:id',verificarToken, CategoryController.updateCategory);
router.put('/categorias/estado/:id', verificarToken,CategoryController.updateCategoryState);
router.delete('/categorias/:id', CategoryController.deleteCategory);
router.get('/categorias-activas', verificarToken,CategoryController.getActiveCategory);
router.get('/categorias-inactivas',verificarToken, CategoryController.getInactiveCategory);
router.get('/categorias-buscar',verificarToken,CategoryController.searchCategory);
router.get('/categorias-nombre', verificarToken,CategoryController.verificarNombreExistente);

module.exports = router;
