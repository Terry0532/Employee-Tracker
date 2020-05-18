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
                choices: ["View all employees", "View all employees by department", "View all employees by managers", "Add a new department", "Add a new role", "Add a new employee", "Exit"]
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
                case "Add a new department":
                    this.askForDepartmentName();
                    break;
                case "Add a new role":
                    this.askForRoleDetails();
                    break;
                case "Exit":
                    tables.connectionEnd();
            }
        });
    }
    askForDepartmentName() {
        inquirer.prompt([
            {
                type: "input",
                message: "Name of the new department?",
                name: "name"
            }
        ]).then(res => {
            tables.addDepartment(res.name);
            this.allPrompts();
        });
    }
    askForRoleDetails() {
        tables.department().then(function (res) {
            let choices = [];
            let departmentArray = res;
            for (let i = 0; i < res.length; i++) {
                choices.push(res[i].name);
            }
            console.log(choices);
            inquirer.prompt([
                {
                    type: "input",
                    message: "Name of the new role?",
                    name: "name"
                }, {
                    type: "input",
                    message: "What's the salary?",
                    name: "salary",
                    validate: (salary) => {
                        if (isNaN(salary)) {
                            return 'Enter a number';
                        } else {
                            return true;
                        }
                    }
                }, {
                    type: "list",
                    message: "Under which department?",
                    name: "department",
                    choices: choices
                }
            ]).then(res => {
                let temp = departmentArray.find(object => object.name === res.department);
                tables.addRole(res.name, res.salary, temp.id);
            });
        });
    }
}

const prompts = new Prompts();

prompts.allPrompts();