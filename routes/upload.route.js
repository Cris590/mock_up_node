const { Router } = require('express');
const { check } = require('express-validator');
const { uploadFile } = require('../controllers/upload.controller');

const {validarCampos}=require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
  


const router = Router();

//ROUTES


//Crear categoria nuevo
router.post('/', uploadFile );


module.exports = router;