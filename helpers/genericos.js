const modelToObject =(model)=>{
    //Metodo para que el resultado de un query del ORM me lo pase a un objeto
    let string=JSON.stringify(model);
    return JSON.parse(string);
}

module.exports ={
    modelToObject
}