
const { Router } = require('express');
const { check } = require('express-validator');
const {validarCampos}=require('../middlewares/validar-campos');

const { usuariosGet,
        usuariosPut,
        usuariosPost,
        usuariosDelete,
        usuariosPatch } = require('../controllers/usuarios');


const {esRolValido , esEmailUnico ,existeUsuarioPorId}= require('../helpers/db-validators')
  

const router = Router();


router.get('/', usuariosGet );

router.put('/:id',[
    check('id').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').optional().custom( esRolValido ),
    validarCampos
] ,usuariosPut );


//El middleware de check revisa el campo correo del request y mira si es email, y de acuerdo a esto llama, en el controlador, el
//error que puede atrapar por medio del get y del requestValidator
router.post('/',[
    check('correo','El correo no es válido').isEmail(),
    check('correo').custom( esEmailUnico ),    
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','El password es obligatorio y debe ser mayor a 6 letras').isLength({min:6}).not().isEmpty(),
    // check('rol','No es un rol permitido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom( esRolValido ),
    validarCampos
], usuariosPost );

router.delete('/:id',
[   check('id').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
]
, usuariosDelete );

router.patch('/', usuariosPatch );
 




module.exports = router;