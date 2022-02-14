const { response, request } = require('express');
const Usuario= require('../models/usuario')
const bcryptjs= require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');



const usuariosGet = async (req = request, res = response) => {

    // const { q, nombre = 'No name', apikey, page = 1, limit } = req.query;
    const {limite=5 ,desde=0}=req.query;
    const query = {estado:true}
    
    // const usuariosGet=await Usuario.find(query)
    //                         .limit(Number(limite))
    //                         .skip(Number(desde));

    // const total = await Usuario.countDocuments(query);

    // ** Hacer un arreglo de promesas, para que se ejecuten al tiempo.
    // ** y en respuesta se guarda la salida de ambas promesas resueltas.
    const [total,usuarios]=await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
                .limit(Number(limite))
                .skip(Number(desde))
    ])

    res.json({
       total,
       usuarios
    });
}

const usuariosPost = async (req, res = response) => {

    let {nombre,correo,password,rol} =req.body;
    const usuario= new Usuario({nombre,correo,password,rol})

    //Encriptar contraseña
    const salt=bcryptjs.genSaltSync();
    usuario.password=bcryptjs.hashSync(password,salt);

    // Generar el JWT
    const token = await generarJWT( usuario.id );

    usuario.save();
    res.json({
        msg: 'post API - usuariosPost',
        usuario,
        token
    });
}

const usuariosPut = async (req, res = response) => {

    const { id } = req.params;
    const { google,password,...resto } = req.body;

    //TODO validar contra base de datos

    if(password){
         //Encriptar contraseña
        const salt=bcryptjs.genSaltSync();
        resto.password=bcryptjs.hashSync(password,salt);
    }

    //Se envia el id como primer parametro y el resto de la peticion como segundo
    //con el parametro new:true se devuelve el usuario actualizado
    const usuario = await Usuario.findByIdAndUpdate(id,resto, {new: true})

    res.json({
        msg: 'put API - usuariosPut',
        usuario
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = async (req, res = response) => {

    const { id}= req.params;

    //borrar fisicamente (No recomendable)
    //const usuario = await usuario.findByIdAndDelete(id)

    const usuario = await Usuario.findByIdAndUpdate(id,{estado:false},{new: true})
    res.json({
        msg:'Usuario eliminado correctamente',
        usuario

    });
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}