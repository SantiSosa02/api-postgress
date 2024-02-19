const jwt = require('jsonwebtoken');
require ('dotenv').config();

function verificarToken(req, res, next) {
    const token= req.header('x-token');

    if(!token){
        return res.status(401).json({error: "Acceso no autorizado. Token no proporcionado."})
    }

    try{
        const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        console.log(decoded);
        req.usuario = decoded.usuario;
        next();
    }catch (error){
        console.log(error);
        return res.status(401).json({error: 'Token no valiodo.'});
    }
}

module.exports = verificarToken;