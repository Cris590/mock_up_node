const {Schema,model}=require('mongoose');

const UsuarioSchema=Schema({
    nombre:{
        type:String,
        required:[true,'El nombre es obligatorio'],
    },
    correo:{
        type:String,
        required:[true,'El correo es obligatorio'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'La contraseña es obligatorio'],
    }, 
    image:{
        type:String,
    },
    rol:{
        type:String,
        required:true
    },
    estado:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default:false
    }
});


//Funciona automaticamente cuando la instancia del objeto devuelve algo, 
//En este caso se usa para quitar los campos __v y pass del objeto que devuelve
UsuarioSchema.methods.toJSON = function(){
    //Saco los campos __v y password del objeto de entrada y el resto lo guarda en usuario
    const {__v,password,...usuario}=this.toObject();
    return usuario;
}



//El primer parametro es el nombre (mongose le va a poner una s al final [Usuarios],y el schema)
module.exports = model('Usuario',UsuarioSchema);
