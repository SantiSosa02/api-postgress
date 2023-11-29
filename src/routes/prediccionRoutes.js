const express = require('express');
const router = express.Router();
const prediccionController = require('../controllers/prediccionController');
const Producto = require('../models/producto');

// Ruta para realizar la predicción
router.post('/realizar-prediccion', async (req, res) => {
    try {
        // Obtener todos los productos de la base de datos
        const productos = await Producto.findAll();
        // Llamar a la función de predicción con los productos
        const resultadoPrediccion = await prediccionController.realizarPrediccion(productos);

        // Enviar el resultado de la predicción como respuesta JSON
        res.json(resultadoPrediccion);
    } catch (error) {
        console.error('Error en la ruta de predicción:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;