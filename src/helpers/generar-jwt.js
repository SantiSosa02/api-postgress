const jwt = require('jsonwebtoken');
require('dotenv').config();

const generarJWT = (id = '') => {

    return new Promise( (resolve, reject) => {

        const payload = { id }

        jwt.sign(payload , process.env.SECRETORPRIVATEKEY ,{
            expiresIn:'1m'
        }, (err, token)=>{
            if(err){
                console.log(err);
                reject('No se puedo generar el toekn')
            }else{
                resolve(token)
            }
        })
    })
}

module.exports= {
    generarJWT
}