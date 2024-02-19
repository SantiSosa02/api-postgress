const jwt = require('jsonwebtoken');
require('dotenv').config();

function verificarToken(req, res, next) {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({ error: "Acceso no autorizado. Token no proporcionado." });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        console.log(decoded);
        req.usuario = decoded.usuario;
        next();
    } catch (error) {
        console.log(error);
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ error: 'Token expirado.' });
        } else {
            return res.status(401).json({ error: 'Token no válido.' });
        }
    }
}

module.exports = verificarToken;
