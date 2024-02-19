const jwt = require('jsonwebtoken');
require('dotenv').config();

const REFRESH_WINDOW = 60; // 60 segundos, 1 minuto

const generarJWT = (id = '') => {
    return new Promise((resolve, reject) => {
        const payload = { id };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '2m' // El token expira en 2 minutos
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        });
    });
};

const refrescarJWT = (id = '') => {
    console.log("Token refrescado"); // Mensaje de registro para comprobar que el token se está refrescando
    return generarJWT(id);
};

module.exports = {
    generarJWT,
    refrescarJWT,
    REFRESH_WINDOW
};
