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
                case "Add a new employee":
                    this.askForEmployeeDetails();
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
        const self = this;
        tables.table("department").then(function (res) {
            const choices = [];
            const departmentArray = res;
            for (let i = 0; i < res.length; i++) {
                choices.push(res[i].name);
            }
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
                }, {
                    type: "confirm",
                    message: "Is this a management level role?",
                    name: "management"
                }
            ]).then(res => {
                const temp = departmentArray.find(department => department.name === res.department);
                const tempManagement = res.management ? 1 : 0;
                console.log(tempManagement);
                tables.addRole(res.name, res.salary, temp.id, tempManagement);
                self.allPrompts();
            });
        });
    }
    async askForEmployeeDetails() {
        const role = [];
        let managerName = ["none"];
        let roleTable;
        let managementLevelEmployee;
        await tables.table("role").then(function (res) {
            roleTable = res;
            for (let i = 0; i < res.length; i++) {
                role.push(res[i].title);
            }
        });
        await tables.managementLevelEmployee(function (result) {
            managementLevelEmployee = result;
            for (let i = 0; i < managementLevelEmployee.length; i++) {
                managerName.push(managementLevelEmployee[i].Name);
            }
        });
        inquirer.prompt([
            {
                type: "input",
                message: "New employee's first name?",
                name: "firstName"
            }, {
                type: "input",
                message: "New employee's last name?",
                name: "lastName"
            }, {
                type: "list",
                message: "New employee's role?",
                name: "role",
                choices: role
            }, {
                type: "list",
                message: "New employee's manager?",
                name: "managerName",
                choices: managerName
            }
        ]).then(res => {
            const role = roleTable.find(role => role.title === res.role);
            let managerId;
            for (let i = 0; i < managementLevelEmployee.length; i++) {
                if (res.managerName == managementLevelEmployee[i].Name) {
                    managerId = managementLevelEmployee[i].id;
                } else if (res.managerName === "none") {
                    managerId = null;
                }
            }
            tables.addEmployee(res.firstName, res.lastName, role.id, managerId);
            this.allPrompts();
        });
    }
}

const prompts = new Prompts();

prompts.allPrompts();