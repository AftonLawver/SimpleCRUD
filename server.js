const express = require('express');
const path = require("path");
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
app.use(express.static(path.join(__dirname, 'public')));
const mysql = require('mysql2');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});


const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

//creating route for the app to get all employees
app.get('/', (req, res) => {
    connection.connect();
    connection.query('SELECT * from employees', function(err, rows, fields) {
        if (!err) {
            console.log(JSON.stringify(rows));
            res.send(JSON.stringify(rows));
        } else {
            console.log('Error while performing Query.');
        }
    });
    connection.end();
});

app.listen(PORT, err => {
    if (err) {
        return console.log("ERROR", err);
    }
    console.log(`Server started on port ${PORT}`);
});

