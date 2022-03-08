const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const {Producto}=require('../models/orm_models/productos.model')
const {Usuario}=require('../models/orm_models/usuario.model')

const subirArchivoCloudinary= async (files, extensionesValidas= ['png','jpg','jpeg','gif'],coleccion,id=null)=>{
    try {
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[ nombreCortado.length - 1 ];

        // Validar la extension
        if ( !extensionesValidas.includes( extension ) ) {
            return {
                ok:false,
                msg:(`La extensión ${ extension } no es permitida - ${ extensionesValidas }`)
            };
        }

        //Si existe el id se va a hacer la validacion de imagenes previas
        if(id){
            let modelo;
            switch ( coleccion ) {
                case 'usuarios':
                    modelo = await Usuario.findByPk(id);
                    if ( !modelo ) {
                        return {
                            ok:false,
                            msg: `No existe un usuario con el id ${ id }`
                        };
                    }
                
                break;
    
                case 'productos':
                    modelo = await Producto.findByPk(id);
                    if ( !modelo ) {
                        return{
                            ok:false,
                            msg: `No existe un producto con el id ${ id }`
                        };
                    }
                
                break;
            
                default:
                    return { 
                        ok:false,
                        msg: 'Se me olvidó validar esto'
                    };
            }
    
            // Limpiar imágenes previas
            if ( modelo.imagen ) {
                const nombreArr = modelo.imagen.split('/');
                const nombre    = nombreArr[ nombreArr.length - 1 ];
                const [ public_id ] = nombre.split('.');
                cloudinary.uploader.destroy( public_id );
            }
        }
        

        const { tempFilePath } = files.archivo
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        // modelo.imagen = secure_url;
        // await modelo.update();
        return { 
            ok:true,
            msg:"Imagen cargada exitosamente",
            url:secure_url
        }
    } catch (error) {
        return {
            ok:false,
            msg:"Ups ... hubo un problema al guardar la imagen",
        }
    }
    
}

module.exports = {
    subirArchivoCloudinary
}