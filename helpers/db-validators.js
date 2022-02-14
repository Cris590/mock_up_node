
const Role = require('../models/role');
const Usuario= require('../models/usuario')

//Verificar que el rol sea valido
const esRolValido = async (rol = '') => { 
    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
      throw new Error(`Rol *${rol}* no válido`);
    }
  }


//Verificar si el correo existen
const esEmailUnico=async (correo) => {  
    const verificarCorreo = await Usuario.findOne({correo});
    if(!!verificarCorreo){
        throw new Error(`El correo ${correo} ya está registrado `);
    }
}


//Verificar si existe un usuario con ese id
const existeUsuarioPorId=async (id) => {  
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario){
        throw new Error(`El id ${id} no existe`);
    }
}


module.exports ={
    esRolValido,
    esEmailUnico,
    existeUsuarioPorId
}