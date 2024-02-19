const jwt = require('jsonwebtoken');
require('dotenv').config();

const REFRESH_WINDOW = 60; // 30 minutos en segundos

const generarJWT = (id = '') => {
    return new Promise((resolve, reject) => {
        const payload = { id }

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '2m'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        })
    })
}

const refrescarJWT = (id = '') => {
    console.log("Token refrescaod")
    return generarJWT(id);

}

module.exports = {
    generarJWT,
    refrescarJWT,
    REFRESH_WINDOW
}
