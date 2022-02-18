const { response, request } = require('express');
const { Usuario, Rol }= require('../models/orm_models/usuario.model')
const bcryptjs= require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { stringify } = require('nodemon/lib/utils');
const { modelToObject } = require('../helpers/genericos');

const usuariosGet = async (req = request, res = response) => {
    if(req.params.id_usuario){
        const {id_usuario}=req.params
        const usuario= await Usuario.findByPk(id_usuario);
        res.json({
            msg: 'ok',
            usuario:{
                id_usuario:usuario.id_usuario,
                identificacion:usuario.identificacion,
                nombre:usuario.nombre,
                id_role:usuario.id_role,
                activo: usuario.activo
            },
        });

    }else{
        try {
            const usuarios=await Usuario.findAll({raw:true})
    
            const newUsuarios=await Promise.all(
                usuarios.map( async (usuario)=>{
                    const rol=await Rol.findByPk(usuario.id_role, {raw: true});
                    userFixed={
                        id_usuario:usuario.id_usuario,
                        identificacion:usuario.identificacion,
                        nombre:usuario.nombre,
                        id_role:usuario.id_role,
                        activo: usuario.activo
                    }
                    const newUser = { id_usuario:usuario.id_usuario,
                        identificacion:usuario.identificacion,
                        nombre:usuario.nombre,
                        id_role:usuario.id_role,
                        activo: usuario.activo,
                        role: rol.nombre
                    }
                    return newUser
                })
            )
     
            res.json({
               msg:'ok',
               usuarios:newUsuarios
            });
        } catch (error) {
            throw new Error(error);
        }
    }
    
   
}

const usuariosPost = async (req, res = response) => {
    try {
        let {identificacion,nombre,password} =req.body;
        const usuario= new Usuario({identificacion,nombre,password,activo:'1',id_role:'2'})
    
        //Encriptar contraseña
        const salt=bcryptjs.genSaltSync();
        usuario.password=bcryptjs.hashSync(password,salt);
        await usuario.save();
        let usuarioNuevo=modelToObject(usuario)
        // Generar el JWT
        const token = await generarJWT( usuarioNuevo.id_usuario );
        res.json({
            msg: 'ok',
            usuario:{
                id_usuario:usuario.id_usuario,
                identificacion:usuario.identificacion,
                nombre:usuario.nombre,
                id_role:usuario.id_role,
                activo: usuario.activo
            },
            token
        });

    } catch (error) {
        res.status(500).json({
            msg:'Comuniquese con el administrador X002'
        })
    }
   
}

const usuariosPut= async (req,res = response)=>{
    let {body} =req;
    let {id_usuario} =req.params;

    try {
        if(!!body.identificacion){
            //Verificar si la identificacion a modificar no esté creada
            const usuarioIdentificado= await Usuario.findOne({where: {identificacion:body.identificacion}})
            if(usuarioIdentificado){
                return res.status(404).json({
                    msg:`Ya existe un usuario identificado con ${body.identificacion}`
                })
            }
        }
        //Encriptar contraseña
        if(!!body.password){
            const salt=bcryptjs.genSaltSync();
            var newPassword=bcryptjs.hashSync(body.password,salt);
            body.password = newPassword;
        }

        
        //Actualizar
        const usuario = await Usuario.findByPk(id_usuario)
         //Armar el body
         let newUser= {
            nombre:body.nombre || usuario.nombre,
            identificacion:body.identificacion || usuario.identificacion,
            password:body.password || usuario.password,
            activo:body.activo || usuario.activo,
            id_role:body.id_role || usuario.id_role,
        }
        await usuario.update(newUser)
        res.json({
            msg: 'ok - usuario actualizado',
            usuario:{
                id_usuario:usuario.id_usuario,
                identificacion:usuario.identificacion,
                nombre:usuario.nombre,
                id_role:usuario.id_role,
                activo: usuario.activo
            }
        });

    } catch (error) {
        res.status(500).json({
            msg:'Comuniquese con el administrador X003'
        })
    }
}

const usuatiosActivate = async (req, res = response,activo)=> {
    const {id_usuario}=req.params
    try {
        const usuario =await Usuario.findByPk(id_usuario)
        await usuario.update({activo}) 
        res.json({
            msg: `ok - usuario ${usuario.identificacion} borrado correctamente`,
            usuario:{
                id_usuario:usuario.id_usuario,
                identificacion:usuario.identificacion,
            }
        });  

    } catch (error) {
        res.status(500).json({
            msg:'Comuniquese con el administrador X004'
        })
    }
}



module.exports ={
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuatiosActivate
}