const { response, request } = require('express');
const bcryptjs= require('bcryptjs');

const { Usuario, Rol }= require('../models/orm_models/usuario.model')

const {Producto,Categoria}=require('../models/orm_models/productos.model')

const { generarJWT } = require('../helpers/generar-jwt');
const { modelToObject } = require('../helpers/genericos');

const categoriasGet = async (req = request, res = response) => {
    if(req.params.id_categoria){
        const {id_categoria}=req.params
        const categoria= await Categoria.findByPk(id_categoria);
        res.json({
            msg: 'ok',
            categoria
        });
    }else{
        try {
            const categorias=await Categoria.findAll({raw:true})
            res.json({
               msg:'ok',
               categorias
            });
        } catch (error) {
            throw new Error(error);
        }
    }  
}

const categoriasPost = async (req, res = response) => {
    try {
        let {nombre} =req.body;
        const categoria= new Categoria({nombre,activo:'1'})
    
        await categoria.save();
        res.json({
            msg: 'ok',
            categoria
        });

    } catch (error) {
        res.status(500).json({
            msg:'Comuniquese con el administrador X202'
        })
    }
   
}

const categoriasPut= async (req,res = response)=>{
    let {body} =req;
    let {id_categoria} =req.params;

    try {

        //Verificar que la categoria exista
        // if(!!body.id_categoria){
        //     //Verificar si la identificacion a modificar no esté creada
        //     const categoria= await Categoria.findOne({where: {id_categoria:body.id_categoria,activo:true}});
        //     if(!categoria){
        //         return res.status(404).json({
        //             msg:`El producto debe tener una categoria valida ${body.id_categoria}, `
        //         })
        //     }
        // }
        
        //Actualizar
        const categoria = await Categoria.findByPk(id_categoria)
         //Armar el body
         let newCategoria= {
            nombre:body.nombre || categoria.nombre,
            activo:body.activo || categoria.activo,
        }
        await categoria.update(newCategoria)
        res.json({
            msg: 'ok - categoria actualizada correctamente',
            categoria
        });

    } catch (error) {
        res.status(500).json({
            msg:'Comuniquese con el administrador X203'
        })
    }
}

const categoriasDelete = async (req, res = response)=> {
    const {id_categoria}=req.params
    try {
        const categoria =await Categoria.findByPk(id_categoria)
        await categoria.update({activo:false}) 
        res.json({
            msg: `ok - categoria ${categoria.nombre} borrado correctamente`,
        });  

    } catch (error) {
        res.status(500).json({
            msg:'Comuniquese con el administrador X204'
        })
    }
}



module.exports ={
    categoriasGet,
    categoriasPost,
    categoriasPut,
    categoriasDelete
}