const express = require('express');
const router = express.Router();
const ProductController = require ('../controllers/productoController');
const verificarToken = require('../middleware/verificar-token');


// Ruta para obtener todos los usuarios
router.get('/productos',verificarToken,ProductController.getAllProducts);
router.get('/productos/:id',verificarToken, ProductController.getProductById);
router.post('/productos', verificarToken,ProductController.createProduct);
router.put('/productos/:id', verificarToken,ProductController.updateProduct);
router.delete('/productos/:id', verificarToken,ProductController.deleteProduct)
router.put('/productos/estado/:id', verificarToken,ProductController.updateProductState);
router.get('/productos-activos',verificarToken, ProductController.getActiveProducts);
router.get('/productos-inactivos',verificarToken,ProductController.getInactiveProducts);
router.get('/productos-buscar',verificarToken, ProductController.searchProduct);
router.get('/productos-nombre', verificarToken,ProductController.verificarNombreExistente);
router.put('/productos-agregar/:id', verificarToken,ProductController.agregarCantidad);
router.get('/productos-cantidad/:id',verificarToken,ProductController.getCantidadActual);
router.get('/productos-categoria/:idcategoria',verificarToken,ProductController.getProductosByCategoria);


module.exports = router;
