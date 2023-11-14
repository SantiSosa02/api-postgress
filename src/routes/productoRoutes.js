const express = require('express');
const router = express.Router();
const ProductController = require ('../controllers/productoController');

// Ruta para obtener todos los usuarios
router.get('/productos', ProductController.getAllProducts);
router.get('/productos/:id', ProductController.getProductById);
router.post('/productos', ProductController.createProduct);
router.put('/productos/:id', ProductController.updateProduct);
router.delete('/productos/:id', ProductController.deleteProduct)
router.put('/productos/estado/:id', ProductController.updateProductState);
router.get('/productos-activos', ProductController.getActiveProducts);
router.get('/productos-inactivos', ProductController.getInactiveProducts);
router.get('/productos-buscar', ProductController.searchProduct);
router.get('/productos-nombre', ProductController.verificarNombreExistente);
router.put('/productos-agregar/:id', ProductController.agregarCantidad);
router.get('/productos-cantidad/:id', ProductController.getCantidadActual);
router.get('/productos-categoria/:idcategoria', ProductController.getProductosByCategoria);


module.exports = router;
