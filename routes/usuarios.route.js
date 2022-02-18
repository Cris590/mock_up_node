
const { Router } = require('express');
const { check } = require('express-validator');

const {validarCampos}=require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
  

const { usuariosGet,
        usuariosPut,
        usuariosPost,
        usuatiosActivate,
        usuariosPatch } = require('../controllers/usuarios.controller');


const { esIdentificacionUnico,
        existeUsuarioPorId } = require('../helpers/db-validators');
const { esAdminRole, tieneRol } = require('../middlewares/validar-role');


const router = Router();

//ROUTES

//Obtener todos los usuarios
router.get('/', usuariosGet );

//Obtener usuario por id 
router.get('/:id_usuario',[
    check('id_usuario').custom( existeUsuarioPorId ),
    validarCampos
], usuariosGet );

//Crear usuario nuevo
router.post('/',[
    validarJWT,
    tieneRol(1,2),
    check('identificacion').custom( esIdentificacionUnico ),    
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','El password es obligatorio y debe ser mayor a 6 letras').isLength({min:3}).not().isEmpty(),
    // check('rol','No es un rol permitido').isIn(['ADMIN_ROLE','USER_ROLE']),
    validarCampos
], usuariosPost );

//Actualizar usuario
router.put('/:id_usuario',[
    validarJWT,
    esAdminRole,
    check('id_usuario').custom( existeUsuarioPorId ),
    validarCampos
] ,usuariosPut );

//Inhabilitar un usuario
router.delete('/:id_usuario',
[    
    check('id_usuario').custom( existeUsuarioPorId ),
    validarJWT,
    esAdminRole,
    validarCampos
]
, (req, res) =>usuatiosActivate(req,res,false) );

module.exports = router;