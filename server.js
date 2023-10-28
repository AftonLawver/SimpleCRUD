require('dotenv').config();
const express = require('express');
const app = express();
const path = require("path");
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT;
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log("a user connected.");
});

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.DATABASE_PORT,
    ssl:{ca:process.env.CERT}
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/employees', function(req, res) {
    connection.connect();
    const q = "SELECT * from employees"
    connection.query(q, function(err, data, fields) {
        if (!err) {
            res.send(data);
        } else {
            console.log('Error while performing Query.');
        }
    });
});

app.post("/create", (req, res) => {
    const q = "INSERT INTO employees (`name`,`occupation`,`salary`) VALUES (?)"
    const selectQuery = "SELECT * FROM employees WHERE employee_id = LAST_INSERT_ID()"; // Assuming 'id' is the auto-incremented primary key

    const values = [
        req.body.name,
        req.body.occupation,
        req.body.salary
    ];
    connection.query(q, [values], (err, data) => {
        if (err)
            return res.json(err);
        else {
            connection.query(selectQuery, (err, data) => {
                if (err) {
                    return res.status(500).json(err);
                }
                const insertedEmployee = data[0];
                io.emit('employee', insertedEmployee);
                return res.status(200).json("Employee has been added successfully.");
            });
        }
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
            res.status(200).send('Updated successfully');
        }
    });
});

const server = http.listen(PORT, () => {
    console.log("Server is listening on port", server.address().port)
});



