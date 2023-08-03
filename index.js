const mysql = require('mysql2');
const inquirer = require('inquirer');
const { promisify } = require('util');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'employees_db',
});

// Promisify the db.query function
const queryAsync = promisify(db.query).bind(db);


init();

async function init() {
    while (true) {
        console.log("\n\n");
        greet();
        console.log("\n\n");
        let data = await promptUser();
        if (data.action === "view all departments") {
            try {
                const response = await queryAsync('SELECT * FROM department');
                console.log("success!");
                console.table(response);
            } catch (error) {
                console.log(error);
            }
        }
        else if (data.action === "view all roles") {
            try {
                const response = await queryAsync('SELECT role.*, department.name AS department_name FROM role LEFT JOIN department ON role.department_id = department.id');
                console.log("success!");
                console.table(response);
            } catch (error) {
                console.log(error);
            }
        }
        else if (data.action === "view all employees") {
            try {
                const response = await queryAsync(`
                    SELECT 
                        emp.id AS employee_id,
                        emp.first_name,
                        emp.last_name,
                        role.title AS job_title,
                        department.name AS department,
                        role.salary,
                        CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
                    FROM 
                        employee emp
                    LEFT JOIN 
                        role ON emp.role_id = role.id
                    LEFT JOIN 
                        department ON role.department_id = department.id
                    LEFT JOIN 
                        employee manager ON emp.manager_id = manager.id;
                `);
                console.log('success!');
                console.table(response);
            } catch (error) {
                console.log(error);
            }
        }
        else if (data.action === "add a department") {
            let answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: "departmentName",
                    message: "What would you like to name the department?"
                }
            ]);
            let department = answers.departmentName;
            try {
                const response = await queryAsync('INSERT INTO department(name) VALUES (?)', department);
                console.log('success!');
                console.log(response);
            } catch (error) {
                console.log(error);
            }
        }
        else if (data.action === "add a role") {
            let answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: "roleName",
                    message: "What would you like to name the role?"
                },
                {
                    type: 'input',
                    name: "salary",
                    message: "What is the salary for this role?"
                },
                {
                    type: 'input',
                    name: "departmentId",
                    message: "Enter the department ID for this role:"
                }
            ]);

            let { roleName, salary, departmentId } = answers;
            try {
                const response = await queryAsync('INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?)', [roleName, salary, departmentId]);
                console.log('success!');
                console.log(response);
            } catch (error) {
                console.log(error);
            }
        }

        else if (data.action === "add an employee") {
            try {
                let roleData = await queryAsync('SELECT id, title FROM role');
                let roleChoices = roleData.map(role => role.title);
        
                let managerData = await queryAsync('SELECT id, CONCAT(first_name, " ", last_name) AS manager_name FROM employee');
                let managerChoices = managerData.map(manager => manager.manager_name);
        
                let answers = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: "What is the first name of the employee?"
                    },
                    {
                        type: 'input',
                        name: "lastName",
                        message: "What is the last name of the employee?"
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the role of the employee?',
                        choices: roleChoices
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Who is the employee\'s manager?',
                        choices: managerChoices.concat('None')
                    }
                ]);
        
                // Get the role ID based on the selected role title
                const selectedRole = roleData.find(role => role.title === answers.role);
                const roleId = selectedRole.id;
        
                // Get the manager ID based on the selected manager name
                const selectedManager = managerData.find(manager => manager.manager_name === answers.manager);
                const managerId = selectedManager ? selectedManager.id : null;
        
                // Insert the employee data into the employee table
                const { firstName, lastName } = answers;
                await queryAsync('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, managerId]);
                console.log('Employee added successfully!');
            } catch (error) {
                console.log(error);
            }
        }
        
        




        else if (data.action === "update an employee role") {
            // Add your code to update an employee role here
        }
        else {
            console.log("quit");
            break;
        }
    }
    console.log('Goodbye!');
}



function promptUser(){
    let answers = inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: "What would you like to choose?",
            choices: ["view all departments", "view all roles", 
            "view all employees", "add a department", "add a role", "add an employee", "update an employee role","quit"]
        }
    ]);
    return answers;
}

function greet() {
    console.log(`
      _______ _______  _____          _____  __   __ _______ _______     
      |______ |  |  | |_____] |      |     |   \_/   |______ |______     
      |______ |  |  | |       |_____ |_____|    |    |______ |______     
                                                                         
      _______ _______ __   _ _______  ______ _______  ______             
      |  |  | |_____| | \\  | |_____| |  ____ |______ |_____/             
      |  |  | |     | |  \\_| |     | |_____| |______ |    \\_             
                                                                         
    `);
  }
