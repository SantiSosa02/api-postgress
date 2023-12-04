// const { execSync } = require('child_process');
// const path = require('path');
// const fs = require('fs');

// const realizarPrediccion = (productos) => {
//     try {
//         // Convertir productos a cadena JSON válida
//         const productosJson = JSON.stringify(productos);

//         // Crear un archivo temporal para almacenar la cadena JSON
//         const archivoTemporal = path.join(__dirname, 'productos_temporal.json');
//         fs.writeFileSync(archivoTemporal, productosJson);

//         // Construir la ruta al script de Python
//         const rutaScriptPython = path.join('E:', '6toTrimestre', 'Machine learning', 'prediccion', 'prediccion-visor', 'prediccion.py');

//         // Ejecutar el script de Python leyendo el contenido del archivo temporal
//         const comando = `python "${rutaScriptPython}" "${archivoTemporal}"`;
//         const resultadoPrediccion = execSync(comando, { encoding: 'utf-8' });

//         console.log('Resultado de la predicción:', resultadoPrediccion.trim());

//         // Devolver el resultado de la predicción
//         return JSON.parse(resultadoPrediccion.trim());
//     } catch (error) {
//         console.error('Error al realizar la predicción:', error);
//         throw new Error('Error al realizar la predicción');
//     }
// };

// module.exports = {
//     realizarPrediccion,
// };
