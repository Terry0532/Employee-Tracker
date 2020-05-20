const cTable = require("console.table");
const connection = require("./connection")

class Tables {
    constructor() {
        this.query = "SELECT ";
        this.query += "e.id, CONCAT(first_name, ' ', last_name) AS Name, ";
        this.query += "title AS Title, salary AS Salary, name AS Department, (SELECT CONCAT(first_name, ' ', last_name) FROM employee WHERE id = e.manager_id) AS manager ";
        this.query += "FROM employee e LEFT JOIN role r ON e.role_id = r.id ";
        this.query += "LEFT JOIN department d ON r.department_id = d.id";
    }
    table(tableName) {
        return new Promise(function (resolve, reject) {
            connection.query("SELECT * FROM ??;", tableName, (err, data) => {
                if (err) throw err;
                resolve(data);
            });
        });
    }
    fullNameTable() {
        return new Promise(function (res, rej) {
            connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee;", (err, data) => {
                if (err) throw err;
                res(data);
            });
        });
    }
    removeEmployee(id) {
        connection.query("DELETE FROM employee WHERE id = ?;", id);
        connection.query("UPDATE employee SET manager_id = null where manager_id = ?;", id);
    }
    managementLevelEmployee(cb) {
        connection.query("SELECT e.id, CONCAT(first_name, ' ', last_name) AS Name FROM employee e LEFT JOIN role r ON e.role_id = r.id WHERE management = 1;", (err, data) => {
            if (err) throw err;
            cb(data);
        });
    }
    addDepartment(name) {
        connection.query("INSERT INTO department (name) VALUES (?);", name);
    }
    addRole(title, salary, department_id, management) {
        connection.query("INSERT INTO role (title, salary, department_id, management) VALUES (?, ?, ?, ?);", [title, salary, department_id, management]);
    }
    addEmployee(first_name, last_name, role, manager) {
        connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);", [first_name, last_name, role, manager]);
    }
    updateEmployee(roleId, managerId, employeeId) {
        connection.query("UPDATE employee SET role_id = ?, manager_id = ? WHERE employee.id = ?;", [roleId, managerId, employeeId]);
    }
    allEmployeeAndId() {
        return new Promise(function (resolve, reject) {
            connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee;", (err, data) => {
                if (err) throw err;
                resolve(data);
            });
        })
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
            const table = cTable.getTable(data);
            console.log("\n");
            console.log(table);
        });
    }
    connectionEnd() {
        connection.end();
    }
}

module.exports = Tables;