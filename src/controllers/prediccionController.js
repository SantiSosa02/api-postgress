const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const axios = require('axios');

const realizarPrediccion = async (productos) => {
    try {
        // Convertir productos a cadena JSON válida
        const productosJson = JSON.stringify(productos);

        // Hacer una solicitud POST a la URL del servicio en Render
        const response = await axios.post('https://ultimaprediccion.onrender.com/realizar-prediccion', {
            productos: JSON.parse(productosJson), // Enviar los productos como parte del cuerpo de la solicitud
        });

        // Obtener el resultado de la predicción desde la respuesta
        const resultadoPrediccion = response.data;

        console.log('Resultado de la predicción:', resultadoPrediccion);

        // Devolver el resultado de la predicción
        return resultadoPrediccion;
    } catch (error) {
        console.error('Error al realizar la predicción:', error);
        throw new Error('Error al realizar la predicción');
    }
};

module.exports = {
    realizarPrediccion,
};