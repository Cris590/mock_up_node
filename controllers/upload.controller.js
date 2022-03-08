
const { response } = require('express');

const { subirArchivoCloudinary } = require('../helpers/subir-archivo');

const uploadFile = async(req, res = response) => {

    console.log('Este es el body',req.body)
    console.log('Este es el file',req.files)
    res.json({
        msg:"ok"
    }) 

    // try {
    //     console.log('request',req.files)
    //     const imagenSubida= await subirArchivoCloudinary(req.files,undefined,'productos',1) 
    //     return res.json({
    //         msg:'Cargar archivo',
    //         img: imagenSubida
    //     })
        
    // } catch (error) {
    //     return res.json({
    //         msg:'Paila perror'
    //     })
    // }
    

}





module.exports = {
    // cargarArchivo,
    uploadFile,
    // actualizarImagen,
    // mostrarImagen,
    // actualizarImagenCloudinary
}

