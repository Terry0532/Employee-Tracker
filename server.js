const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_info_db"
});

let query = "SELECT ";
query += "CONCAT(first_name, ' ', last_name) AS 'Full Name', ";
query += "title AS Title, salary AS Salary, name AS Department ";
query += "FROM employee e LEFT JOIN role r ON e.role_id = r.id ";
query += "LEFT JOIN department d ON r.department_id = d.id;";

connection.connect(err => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    renderTable();
})

function renderTable() {
    connection.query(query, (err, data) => {
        if (err) throw err;
        console.log(console.table(data));
        // console.log(data);
        connection.end();
    });
}