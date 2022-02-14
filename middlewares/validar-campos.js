const { validationResult } = require('express-validator');


const validarCampos=(req,res,next) => {

    //Los errrores vienen del request
    const errors=validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400).json(errors)
    }
    next();
};

module.exports={validarCampos}