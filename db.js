const sql = require('mssql');
const config = {
    server : '10.50.241.144', 
    // 192.168.0.4 -->탐탐
    // 10.50.218.189 --> 공학관 Wifi ip
    // 192.168.233.55 --> 핸드폰 핫스팟 ip
    // 10.50.225.13 공학관 ipv4
    port: 1433,
    options: {encrypt:false, database: 'MyDb'},
    authentication: {
        type:"default",
        options:{
            userName:"JW",
            password:"1234"
        }
    }
};

const pool = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL')
        return pool
    })
    .catch(err => console.log('Database Connection Failed! Bad config: ', err))

module.exports = {
    sql, pool
}
