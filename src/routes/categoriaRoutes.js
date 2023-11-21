const express = require('express');
const router = express.Router();
const CategoryController = require ('../controllers/categoriaController');
const verificarToken = require('../middleware/verificar-token');


// Ruta para obtener todos los usuarios
router.get('/categorias', CategoryController.getAllCategories);
router.get('/categorias/:id',CategoryController.getCategoryById);
router.post('/categorias', CategoryController.createCategory);
router.put('/categorias/:id', CategoryController.updateCategory);
router.put('/categorias/estado/:id',CategoryController.updateCategoryState);
router.delete('/categorias/:id', CategoryController.deleteCategory);
router.get('/categorias-activas',CategoryController.getActiveCategory);
router.get('/categorias-inactivas', CategoryController.getInactiveCategory);
router.get('/categorias-buscar',CategoryController.searchCategory);
router.get('/categorias-nombre',CategoryController.verificarNombreExistente);
router.get('/categorias/productos-relacionados/:id',CategoryController.productosAsociados);


module.exports = router;
