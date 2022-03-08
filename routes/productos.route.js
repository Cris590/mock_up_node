const { Router } = require('express');
const { check } = require('express-validator');

const {validarCampos}=require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
  

const { productosGet,
        productosPut,
        productosPost,
        productosDelete, 
        productosGetByParameter} = require('../controllers/productos.controller');


const { esIdentificacionUnico,
        existeUsuarioPorId,
        existeProductoPorId,
        existeCategoriaPorId
    } = require('../helpers/db-validators');
const { esAdminRole, tieneRol } = require('../middlewares/validar-role');


const router = Router();

//ROUTES

//Obtener producto por id 
// router.get('/:id_producto', productosGet );

//Obtener producto por id 
router.get('/:parametro/:valor', productosGetByParameter );


//Obtener todos los productos
router.get('/', productosGet );

//Crear producto nuevo
router.post('/',
[    
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('codigo','El código es obligatorio').not().isEmpty(),
    check('id_categoria','La categoria es obligatoria y debe ser un numero').not().isEmpty().isInt(),
    check('id_categoria').custom( existeCategoriaPorId ),
    check('precio_costo','El costo es obligatorio y debe ser un número valido').not().isEmpty().isNumeric(),
    check('precio_venta','El precio de venta es obligatorio y debe ser un número valido').not().isEmpty(),
    validarCampos
], productosPost );

//Actualizar producto
router.put('/:id_producto',
[   
    validarJWT, 
    esAdminRole, 
    check('id_producto').custom( existeProductoPorId ),
    validarCampos
] ,productosPut );

//Inhabilitar un producto
router.delete('/:id_producto',
[   
    validarJWT, 
    esAdminRole, 
    check('id_producto').custom( existeProductoPorId ),
    validarCampos
]
, productosDelete);

module.exports = router;
