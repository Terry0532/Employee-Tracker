const inquirer = require("inquirer");
const cTable = require("console.table");
const Tables = require("./assets/js/tables");

const tables = new Tables();
tables.displayAllEmployee();
tables.displayAllEmployeeByDepartment();
tables.displayAllEmployeeByManager();
tables.connectionEnd();