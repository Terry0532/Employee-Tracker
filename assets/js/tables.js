const mysql = require("mysql");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_info_db"
});

class Tables {
    constructor() {
        this.query = "SELECT ";
        this.query += "CONCAT(first_name, ' ', last_name) AS Name, ";
        this.query += "title AS Title, salary AS Salary, name AS Department, manager_id AS manager ";
        this.query += "FROM employee e LEFT JOIN role r ON e.role_id = r.id ";
        this.query += "LEFT JOIN department d ON r.department_id = d.id";
    }
    department = function () {
        return new Promise(function (resolve, reject) {
            connection.query("SELECT * FROM department;", (err, data) => {
                resolve(data);
            });
        })
    }
    addDepartment(name) {
        connection.query("INSERT INTO department (name) VALUES (?);", name);
    }
    addRole(title, salary, department_id) {
        connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);", [title, salary, department_id]);
    }
    displayAllEmployee() {
        let tempQuery = this.query;
        this.query += ";";
        this.connectionQuery();
        this.query = tempQuery;
    }
    displayAllEmployeeByDepartment() {
        let tempQuery = this.query;
        this.query += " ORDER BY r.department_id;"
        this.connectionQuery();
        this.query = tempQuery;
    }
    displayAllEmployeeByManager() {
        let tempQuery = this.query;
        this.query += " ORDER BY e.manager_id;"
        this.connectionQuery();
        this.query = tempQuery;
    }
    connectionQuery() {
        connection.query(this.query, (err, data) => {
            if (err) throw err;
            for (let i = 0; i < data.length; i++) {
                if (data[i].manager != null) {
                    let temp = data[i].manager - 1;
                    data[i].manager = data[temp].Name;
                }
            }
            const table = cTable.getTable(data);
            console.log(table);
        });
    }
    connectionEnd() {
        connection.end();
    }
}

module.exports = Tables;