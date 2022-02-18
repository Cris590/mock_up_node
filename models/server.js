const express = require('express');
const cors = require('cors');
const { mysql_db } = require('../database/config_mysql');

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;

        this.paths={
            auth:'/app/auth',
            usuarios:'/app/usuarios',
            productos:'/app/productos',
            categorias:'/app/categorias'
        }

        //Conectar a base de datos mysql
        this.connectMysql()
        // Middlewares
        this.middlewares();
        // Rutas de mi aplicación
        this.routes();

    }

    async connectMysql (){
        try {
            await mysql_db.authenticate();
            // await mysql_db.sync({ force: true });
            // console.log("All models were synchronized successfully.");
            console.log('Estoy conectado a mysql')

        } catch (error) {
            throw new Error(error)
        }
    }

    middlewares() {

        // CORS
        this.app.use( cors() );
        // Lectura y parseo del body
        this.app.use( express.json() );
        // Directorio Público
        this.app.use( express.static('public') );
    }

    routes() {
        
        //Nuevas rutas
        this.app.use( this.paths.auth, require('../routes/auth.route'));
        this.app.use(this.paths.usuarios,require('../routes/usuarios.route'))
        this.app.use(this.paths.productos,require('../routes/productos.route'))
        this.app.use(this.paths.categorias,require('../routes/categorias.route'))
       
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;
