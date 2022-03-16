
const mysql = require('mysql');
const util = require('util');

const startConnection =()=> {
    const mysqlOptions = {};
         mysqlOptions['debug']=true;
         console.log(process.env.DB_HOST);
    const connection = mysql.createConnection( {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },mysqlOptions);
    
    return connection;
};
const makeDb = (connection) => {
    return {
      query( sql, args ) {
        return util.promisify( connection.query )
          .call( connection, sql, args );
      },
      close() {
        
        return util.promisify( connection.end ).call( connection );
      },
    };
};
exports.startConnection = startConnection;
exports.makeDb = makeDb;