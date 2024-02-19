const jwt = require('jsonwebtoken');
const { generarJWT, REFRESH_WINDOW } = require('../helpers/generar-jwt'); // Importa la función de generarJWT y REFRESH_WINDOW
require('dotenv').config();

async function verificarToken(req, res, next) {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({ error: "Acceso no autorizado. Token no proporcionado." })
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        req.usuario = decoded.usuario;

        const tiempoRestante = decoded.exp - Math.floor(Date.now() / 1000);
        if (tiempoRestante < REFRESH_WINDOW) { // Si el tiempo restante es menor que el tiempo de refresco
            const nuevoToken = await generarJWT(decoded.usuario.id); // Genera un nuevo token
            res.set('x-token', nuevoToken); // Envía el nuevo token en la respuesta
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: 'Token no válido.' });
    }
}

module.exports = verificarToken;
