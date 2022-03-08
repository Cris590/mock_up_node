const { Router } = require('express');
const { check } = require('express-validator');

const {validarCampos}=require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
  

const { categoriasGet,
        categoriasPut,
        categoriasPost,
        categoriasDelete } = require('../controllers/categorias.controller');


const { esIdentificacionUnico,
        existeUsuarioPorId,
        existeProductoPorId,
        existeCategoriaPorId} = require('../helpers/db-validators');
const { esAdminRole, tieneRol } = require('../middlewares/validar-role');


const router = Router();

//ROUTES

//Obtener categoria por id 
router.get('/:id_categoria', categoriasGet );

//Obtener todos las categorias
router.get('/', categoriasGet );

//Crear categoria nuevo
router.post('/',[    
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], categoriasPost );

//Actualizar categoria
router.put('/:id_categoria',[
    validarJWT,
    esAdminRole,
    check('id_categoria').custom( existeCategoriaPorId ),
    validarCampos
] ,categoriasPut );

//Inhabilitar un categoria
router.delete('/:id_categoria',
[      
    validarJWT, 
    esAdminRole,
    check('id_categoria').custom( existeCategoriaPorId ),
    validarCampos
]
, categoriasDelete);

module.exports = router;