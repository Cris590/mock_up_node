
const {response} = require('express')

const esAdminRole=(req, res= response,next) =>{

    console.log('Este es el usuario de esAdminRole',req.usuario)
    if(!req.usuario){
        return res.status(500).json({
            msg:"Se requiere validar el token primero"
        })   
    }
    if(req.usuario.id_role !== 1){
        return res.status(500).json({
            msg:"Solo el administrador puede realizar esta acción"
        })   
    }

    next();
}

const tieneRol=(...roles)=>{
    return (req,res = response,next)=>{
        if(!roles.includes(req.usuario.id_role) ){
            return res.status(500).json({
                msg:'Este perfil no tiene permisos para realizar esta acción'
            })
        }
        next()
    }
}

module.exports = {
    esAdminRole,
    tieneRol
}