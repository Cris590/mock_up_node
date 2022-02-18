const { Sequelize, Model, DataTypes } = require('sequelize');
const mysql_db = new Sequelize(process.env.MYSQL_BASE,process.env.MYSQL_USERNAME,process.env.MYSQL_PASSWORD,{
    host: process.env.MYSQL_HOST,
    dialect:'mysql',
    // logging:true,
    define: {
        timestamps: false,
      },
},(err, resp) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});


module.exports={mysql_db} 