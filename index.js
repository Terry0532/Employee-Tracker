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
                choices: ["View all employees", "View all employees by department", "View all employees by managers", "Add a new department", "Add a new role", "Add a new employee", "Update employee", "Remove employee", "Exit"]
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
                case "Update employee":
                    this.updateEmployee();
                    break;
                case "Remove employee":
                    this.removeEmployee();
                    break;
                case "Exit":
                    tables.connectionEnd();
            }
        });
    }
    removeEmployee() {
        const self = this;
        tables.fullNameTable().then(function (result) {
            inquirer.prompt([
                {
                    type: "list",
                    message: "Who do you want to remove?",
                    name: "name",
                    choices: result
                }
            ]).then(res => {
                const removedEmployee = result.find(employee => employee.name === res.name);
                tables.removeEmployee(removedEmployee.id);
                self.allPrompts();
            });
        });
    }
    async updateEmployee() {
        let allEmployeeAndId;
        let roleTable;
        const allEmployeeName = [];
        const roleTitle = [];
        const managerName = ["none"];
        let managementLevelEmployee;
        await tables.allEmployeeAndId().then(function (res) {
            allEmployeeAndId = res;
            for (let employee of res) {
                allEmployeeName.push(employee.name);
            }
        });
        await tables.table("role").then(function (res) {
            roleTable = res;
            for (let role of res) {
                roleTitle.push(role.title);
            }
        });
        tables.managementLevelEmployee(function (res) {
            managementLevelEmployee = res;
            for (let i = 0; i < managementLevelEmployee.length; i++) {
                managerName.push(managementLevelEmployee[i].Name);
            }
        });
        inquirer.prompt([
            {
                type: "list",
                message: "Who do you want to update?",
                name: "name",
                choices: allEmployeeName
            }, {
                type: "list",
                message: "What's their new role?",
                name: "role",
                choices: roleTitle
            }, {
                type: "list",
                message: "Who's their new manager?",
                name: "managerName",
                choices: managerName
            }
        ]).then(res => {
            const role = roleTable.find(role => role.title === res.role);
            const employee = allEmployeeAndId.find(employee => employee.name === res.name);
            let managerId;
            for (let i = 0; i < managementLevelEmployee.length; i++) {
                if (res.managerName == managementLevelEmployee[i].Name) {
                    managerId = managementLevelEmployee[i].id;
                } else if (res.managerName === "none") {
                    managerId = null;
                }
            }
            tables.updateEmployee(role.id, managerId, employee.id);
            this.allPrompts();
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
            const departmentArray = res;
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
                    choices: res
                }, {
                    type: "confirm",
                    message: "Is this a management level role?",
                    name: "management"
                }
            ]).then(res => {
                const temp = departmentArray.find(department => department.name === res.department);
                const tempManagement = res.management ? 1 : 0;
                tables.addRole(res.name, res.salary, temp.id, tempManagement);
                self.allPrompts();
            });
        });
    }
    async askForEmployeeDetails() {
        const role = [];
        const managerName = ["none"];
        let managementLevelEmployee;
        let roleTable;
        await tables.table("role").then(function (res) {
            roleTable = res;
            for (let i = 0; i < res.length; i++) {
                role.push(res[i].title);
            }
        });
        tables.managementLevelEmployee(function (result) {
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