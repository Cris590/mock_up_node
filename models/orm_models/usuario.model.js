const {DataTypes} = require('sequelize');
const {mysql_db} =require('../../database/config_mysql'); 

const Usuario=mysql_db.define('Usuario', {
    id_usuario:{
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER(11)
    },
    identificacion:{
        type:DataTypes.STRING
    },
    nombre: {
        type:DataTypes.STRING
    },
    password: {
        type:DataTypes.STRING
    },
    id_role:{
        type:DataTypes.INTEGER(11)
    },
    activo:{
        type:DataTypes.BOOLEAN
    },
    fecha_creacion:{
        type:DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    fecha_modificacion:{
        type:DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate : DataTypes.NOW,
    }
},{
    tableName:'usuarios',
});


const Rol=mysql_db.define('Rol', {
    id_role:{
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER(11)
    },
    nombre:{
        type:DataTypes.STRING
    },
    activo:{
        type:DataTypes.BOOLEAN
    }
},{tableName:'roles'});

module.exports ={
    Usuario,
    Rol
}