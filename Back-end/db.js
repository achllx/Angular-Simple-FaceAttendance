const mysql = require('mysql2');
const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'absentia_db',
});

connection.connect(err => {
    if (err) {
        console.log(err, 'dberr');
    }
    console.log('db connected . . .');
});

module.exports = connection;