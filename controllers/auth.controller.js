const { response } = require('express');
const bcryptjs = require('bcryptjs')

const { Usuario } = require('../models/orm_models/usuario.model');
const { generarJWT } = require('../helpers/generar-jwt');
const { modelToObject } = require('../helpers/genericos');


const login = async(req, res = response) => {

    const { identificacion, password } = req.body;
    try {
      
        // Verificar si el nombre existe
        const usuario = await Usuario.findOne({ where: { identificacion }});
        auxUsuario=await modelToObject(usuario);
        
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - identificacion'
            });
        }

        // SI el usuario está activo
        if ( !usuario.activo ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, auxUsuario.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT( auxUsuario.id_usuario );
        res.json({
            usuario:{
                id_usuario:usuario.id_usuario,
                identificacion:usuario.identificacion,
                nombre:usuario.nombre,
                rol:usuario.id_role,
                activo: usuario.activo
            },
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Comuniquese con el administrador X100'
        });
    }   

}



module.exports = {
    login
}
