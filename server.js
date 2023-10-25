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
});

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM employees WHERE employee_id = ?';

    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting from MySQL:', err);
            res.status(500).send('Error deleting data');
        } else {
            console.log('Deleted successfully');
            res.status(200).send('Deleted successfully');
        }
    });
});

app.patch('/update/:id', (req, res) => {
    const id = req.params.id;
    const name = req.body.employeeName;
    const occupation = req.body.occupation;
    // const salary = req.body.salary;
    const salary = parseInt(req.body.salary, 10); // Parse the integer

    const query = 'UPDATE employees SET name = ?, occupation = ?, salary = ? WHERE employee_id=?';

    connection.query(query, [name, occupation, salary, id], (err, results) => {
        if (err) {
            console.error('Error updating from MySQL:', err);
            res.status(500).send('Error updating data');
        } else {
            console.log('Updated successfully');
            res.status(200).send('Updated successfully');
        }
    });
});
app.listen(PORT, err => {
    if (err) {
        return console.log("ERROR", err);
    }
    console.log(`Server started on port ${PORT}`);
});

