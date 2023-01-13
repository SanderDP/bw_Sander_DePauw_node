var mysql = require('mysql');

// establish connection to database
var conpool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'project',
    password: 'ProjectPassword159753',
    database: 'laravel_project'
  });

module.exports = conpool;