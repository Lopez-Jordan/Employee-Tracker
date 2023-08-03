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

greet();
init();

async function init() {
    while (true) {
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
        /////////////////////////////////////////////////////
        else if (data.action === "add an employee") {
            // Add your code to add an employee here
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
