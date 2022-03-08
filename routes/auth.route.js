const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');


const { login, renovateToken } = require('../controllers/auth.controller');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

router.post('/login',[
    check('identificacion', 'El usuario es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login );

router.get('/renew',[
    validarJWT,
    validarCampos
],renovateToken );



module.exports = router;