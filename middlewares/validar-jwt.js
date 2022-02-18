
const jwt = require('jsonwebtoken');
const {Usuario} = require('../models/orm_models/usuario.model')

const validarJWT = async (req,res,next) => {
    const token=req.header('x-token');
    console.log('Este es el token',token)
    if(!token) {
        return res.status(401).json({
            msg:"El token obligatorio"
        })
    }

    const {uid}=jwt.verify(token,process.env.SECRETORPRIVATEKEY);
    try {    
        const usuario=await Usuario.findByPk(uid)
        if(!usuario.activo){
            return res.status(401).json({
                msg:"Token no valido - usuario no valido"
            }) 
        }

        req.usuario=usuario;
        next()   
    } catch (error) {
        return res.status(401).json({
            msg:"Token no valido"
        })
    }
}

module.exports = {
    validarJWT
}