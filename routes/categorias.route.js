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

//Obtener producto por id 
router.get('/:id_categoria', categoriasGet );

//Obtener todos los productos
router.get('/', categoriasGet );

//Crear producto nuevo
router.post('/',[    
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], categoriasPost );

//Actualizar producto
router.put('/:id_categoria',[
    check('id_categoria').custom( existeCategoriaPorId ),
    validarCampos
] ,categoriasPut );

//Inhabilitar un producto
router.delete('/:id_categoria',
[    
    check('id_categoria').custom( existeCategoriaPorId ),
    validarCampos
]
, categoriasDelete);

module.exports = router;