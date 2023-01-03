const mysql = require('mysql');

function getConnection(){
    return connection = mysql.createConnection({
        host: 'in-mum-web841.main-hosting.eu',    
        database:process.env.MYSQL_DB,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        connectionLimit: 50,
        queueLimit: 0,
        waitForConnection: true
    })
}

module.exports = {
    getConnection:getConnection
}