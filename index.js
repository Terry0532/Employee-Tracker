const inquirer = require("inquirer");
const Tables = require("./assets/js/tables");

const tables = new Tables();

class Prompts {
    allPrompts() {
        inquirer.prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "choices",
                choices: ["View all employees", "View all employees by department", "View all employees by managers", "Exit"]
            }
        ]).then(res => {
            switch (res.choices) {
                case "View all employees":
                    tables.displayAllEmployee();
                    this.allPrompts();
                    break;
                case "View all employees by department":
                    tables.displayAllEmployeeByDepartment();
                    this.allPrompts();
                    break;
                case "View all employees by managers":
                    tables.displayAllEmployeeByManager();
                    this.allPrompts();
                    break;
                case "Exit":
                    tables.connectionEnd();
            }
        });
    }
}

const prompts = new Prompts();

prompts.allPrompts();