const { response, request } = require('express');
const bcryptjs= require('bcryptjs');

const { Usuario, Rol }= require('../models/orm_models/usuario.model')

const {Producto,Categoria}=require('../models/orm_models/productos.model')

const { generarJWT } = require('../helpers/generar-jwt');
const { modelToObject } = require('../helpers/genericos');
const { subirArchivoCloudinary } = require('../helpers/subir-archivo');

const productosGetByParameter = async (req = request, res = response) => {

    const arrayParameters=['id_producto','codigo']

    const {parametro,valor}=req.params;
    
    if(arrayParameters.includes(parametro)){

        const producto= await Producto.findOne({where: {
            [parametro]:valor
        }});
    
        res.json({
            ok:true,
            msg: 'ok',
            producto
        });

    }else{
        return res.status(404).json({
            ok:false,
            msg:"El parametro de busqueda no es valido"
        })
    }

   
 
}

const productosGet = async (req = request, res = response) => {
    if(req.params.id_producto){
        const {id_producto}=req.params
        const producto= await Producto.findByPk(id_producto);
        res.json({
            ok:true,
            msg: 'ok',
            producto
        });
    }else{
        try {
            const productos=await Producto.findAll({raw:true})
            res.json({
               ok:true,
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
        let imagen=''
        
        if(req.files && req.files.archivo){
            console.log('Existe imagen señores')
            const resp = await subirArchivoCloudinary(req.files,undefined,'productos') 
            if(resp.ok){imagen = resp.url};
        }

        let {nombre, codigo ,precio_costo,precio_venta,id_categoria} =req.body; 
        const producto= new Producto({nombre, codigo,precio_costo,precio_venta,id_categoria ,imagen,activo:'1'})
        await producto.save();
        res.json({
            ok:true,
            msg: 'ok, producto creado correctamente',
            producto
        });

    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'Comuniquese con el administrador X102'
        })
    }
   
}

const productosPut= async (req,res = response)=>{

    console.log('Este es el body',req.body);
    console.log('Este es el files',req.files)
    console.log('Estos son los params',req.params);
    let {body} =req;
    let {id_producto} =req.params;

    // res.json({
    //     ok:false,
    //     msg:'Estamos trabajando'
    // })


    try {

        // Verificar que la categoria exista
        if(!!body.id_categoria){
            //Verificar si la identificacion a modificar no esté creada
            const categoria= await Categoria.findOne({where: {id_categoria:body.id_categoria,activo:true}});
            if(!categoria){
                return res.status(404).json({
                    ok:false,
                    msg:`El producto debe tener una categoria valida ${body.id_categoria}, `
                })
            }
        }

        // Verificar imagen
        let imagenActualizada=null;
        
        if(req.files && req.files.archivo){

            console.log('Hola si existo')
            const resp = await subirArchivoCloudinary(req.files,undefined,'productos',id_producto) 
            console.log('Y esta es la respuesta',resp)
            if(resp.ok){imagenActualizada = resp.url};
        }



        //Llamar el producto
        const producto = await Producto.findByPk(id_producto)

         // Verificar que el codigo exista y sea valido
        if(!!body.codigo){
            let {codigo}=body;
            let productoCodigo=await Producto.findOne({where:{codigo}});

            if(!!productoCodigo){
                if(productoCodigo.id_producto !==producto.id_producto){
                    return res.status(404).json({
                        ok:false,
                        msg:`El codigo ${codigo} del producto ya existe, intente uno diferente `
                    })
                }
            }
        }

        console.log('Esta deberia ser la imagen',imagenActualizada)
        
        //Actualizar
         //Armar el body
         let newProducto= {
            nombre:body.nombre || producto.nombre,
            codigo:body.codigo || producto.codigo,
            imagen:imagenActualizada || producto.imagen,
            id_categoria:body.id_categoria || producto.id_categoria,
            codigo:body.codigo || producto.codigo,
            precio_costo:body.precio_costo || producto.precio_costo,
            precio_venta:body.precio_venta || producto.precio_venta,
            activo:body.activo || producto.activo,
        }
        await producto.update(newProducto)
        res.json({
            ok:true,
            msg: 'ok - producto actualizado',
            producto
        });

    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'Comuniquese con el administrador X103'
        })
    }
}

const productosDelete = async (req, res = response)=> {
    const {id_producto}=req.params
    try {
        const producto =await Producto.findByPk(id_producto)
        await producto.update({activo:!producto.activo}) 
        let msg=(producto.activo) ?  `ok - producto ${producto.nombre} activado correctamente`:  `ok - producto ${producto.nombre} borrado correctamente`
      
        res.json({
            ok:true,
            msg,
        });  

    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'Comuniquese con el administrador X104'
        })
    }
}



module.exports ={
    productosGetByParameter,
    productosGet,
    productosPost,
    productosPut,
    productosDelete
}