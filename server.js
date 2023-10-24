const express = require('express');
const app = express();
const path = require("path");
require('dotenv').config();
const PORT = process.env.PORT;
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.set("view engine", "ejs");

const mysql = require('mysql2');
app.use(express.static(path.join(__dirname, 'public')));

// app.set('views', path.join(__dirname, 'views'));

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

app.get('/', function(req, res) {
    connection.connect();
    const q = "SELECT * from employees"
    connection.query(q, function(err, data, fields) {
        if (!err) {
            const users = data;
            res.render("index.ejs", { users });
            // return res.json(data);
        } else {
            console.log('Error while performing Query.');
        }
    });
});



// creating route for the app to get all employees
app.get('/employees', (req, res) => {
    connection.connect();
    const q = "SELECT * from employees"
    connection.query(q, function(err, data, fields) {
        if (!err) {
            return res.json(data);
        } else {
            console.log('Error while performing Query.');
        }
    });
    connection.end();
});

app.post("/create", (req, res) => {
    const q = "INSERT INTO employees (`name`,`occupation`,`salary`) VALUES (?)"
    const values = [
        req.body.name,
        req.body.occupation,
        req.body.salary
    ];
    connection.query(q, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json("Employee has been added successfully.");
    })
})

app.listen(PORT, err => {
    if (err) {
        return console.log("ERROR", err);
    }
    console.log(`Server started on port ${PORT}`);
});

