const { response, request } = require('express');
const bcryptjs= require('bcryptjs');

const { Usuario, Rol }= require('../models/orm_models/usuario.model')

const {Producto,Categoria}=require('../models/orm_models/productos.model')

const { generarJWT } = require('../helpers/generar-jwt');
const { modelToObject } = require('../helpers/genericos');

const productosGet = async (req = request, res = response) => {
    if(req.params.id_producto){
        const {id_producto}=req.params
        const producto= await Producto.findByPk(id_producto);
        res.json({
            msg: 'ok',
            producto
        });
    }else{
        try {
            const productos=await Producto.findAll({raw:true})
            res.json({
               msg:'ok',
               productos
            });
        } catch (error) {
            throw new Error(error);
        }
    }  
}

const productosPost = async (req, res = response) => {
    try {
        let {nombre,precio_costo,precio_venta,id_categoria} =req.body;
        const producto= new Producto({nombre,precio_costo,precio_venta,id_categoria ,activo:'1'})
    
        await producto.save();
        res.json({
            msg: 'ok',
            producto
        });

    } catch (error) {
        res.status(500).json({
            msg:'Comuniquese con el administrador X102'
        })
    }
   
}

const productosPut= async (req,res = response)=>{
    let {body} =req;
    let {id_producto} =req.params;

    try {

        // Verificar que la categoria exista
        if(!!body.id_categoria){
            //Verificar si la identificacion a modificar no esté creada
            const categoria= await Categoria.findOne({where: {id_categoria:body.id_categoria,activo:true}});
            if(!categoria){
                return res.status(404).json({
                    msg:`El producto debe tener una categoria valida ${body.id_categoria}, `
                })
            }
        }
        
        //Actualizar
        const producto = await Producto.findByPk(id_producto)
         //Armar el body
         let newProducto= {
            nombre:body.nombre || producto.nombre,
            precio_costo:body.precio_costo || producto.precio_costo,
            precio_venta:body.precio_venta || producto.precio_venta,
            activo:body.activo || producto.activo,
        }
        await producto.update(newProducto)
        res.json({
            msg: 'ok - producto actualizado',
            producto
        });

    } catch (error) {
        res.status(500).json({
            msg:'Comuniquese con el administrador X103'
        })
    }
}

const productosDelete = async (req, res = response)=> {
    const {id_producto}=req.params
    try {
        const producto =await Producto.findByPk(id_producto)
        await producto.update({activo:false}) 
        res.json({
            msg: `ok - producto ${producto.nombre} borrado correctamente`,
        });  

    } catch (error) {
        res.status(500).json({
            msg:'Comuniquese con el administrador X104'
        })
    }
}



module.exports ={
    productosGet,
    productosPost,
    productosPut,
    productosDelete
}