const {DataTypes} = require('sequelize');
const {mysql_db} =require('../../database/config_mysql'); 

const Producto=mysql_db.define('Producto', {
    id_producto:{
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    id_categoria:{
        type: DataTypes.INTEGER
    },
    nombre: {
        type:DataTypes.STRING
    },
    precio_costo: {
        type:DataTypes.DECIMAL(8,2)
    },
    precio_venta: {
        type:DataTypes.DECIMAL(8,2)
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
    tableName:'productos',
});


const Categoria=mysql_db.define('Categoria', {
    id_categoria:{
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER(11)
    },
    nombre:{
        type:DataTypes.STRING
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
    tableName:'categorias',
});

module.exports ={
    Producto,
    Categoria
}
