
const { Producto,Categoria } = require('../models/orm_models/productos.model');
const {Usuario}= require('../models/orm_models/usuario.model')


//////////////////////////
//VALIDADORES DE USUARIO//
//////////////////////////


//Verificar si la identificacion del usuario ya existe
const esIdentificacionUnico=async (identificacion) => {  
  
    //Verificar que no exista un usuario
    const existeUsuario=await Usuario.findOne({
        where:{identificacion}
    })
    if(!!existeUsuario){
        throw new Error(`El usuario con la  identificacion ${identificacion} ya está registrado `);
    }
}

//Verificar si la identificacion del usuario ya existe
const existeUsuarioPorId=async (id_usuario) => {  
    //Verificar que exista un usuario
    const existeUsuario=await Usuario.findOne({
        where:{id_usuario}
    })
    if(!existeUsuario){
        throw new Error(`El usuario con con el id => ${id_usuario} no está registrado `);
    }
}



////////////////////////////
//VALIDADORES DE CATEGORIA
/// Y PRODUCTOS//////////////
////////////////////////////
//Verificar si la identificacion del usuario ya existe
const existeProductoPorId=async (id_producto) => {  
    //Verificar que no exista un usuario
    const existeProducto=await Producto.findOne({
        where:{id_producto}
    })
    if(!existeProducto){
        throw new Error(`El producto con el id ${id_producto} no existe `);
    }
}
//Verificar si la identificacion del usuario ya existe
const existeCategoriaPorId=async (id_categoria) => {  
  
    //Verificar que no exista un usuario
    const existeCategoria=await Categoria.findOne({
        where:{id_categoria}
    })
    if(!existeCategoria){
        throw new Error(`La caetgoriía con el id ${id_categoria} no existe `);
    }
}


module.exports ={
    esIdentificacionUnico,
    existeUsuarioPorId,
    existeProductoPorId,
    existeCategoriaPorId
}