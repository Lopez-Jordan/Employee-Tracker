const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection( 
    {
        host: '127.0.0.1',
        user: 'root',
        password: 'password',
        database: 'employees_db'
    },
    console.log("Connected to the database!")
)
greet();
init();

async function init(){
    while (true){
        console.log("/n/n");
        let data = await promptUser();
        if (data.action === "view all departments"){
            db.query('SELECT * FROM department',(error, response)=>{
                error ? console.log(error) : console.log("success!");
                console.log(response);  // needs to be in a nice formatted table
            });
        }
        else if (data.action === "view all roles"){
            db.query('SELECT * FROM role', (error, response)=>{
                error ? console.log(error) : console.log("success!");
                console.log(response);
            });
        }
        else if (data.action === "view all employees"){
            db.query(`
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
                    `, (error, response)=>{
                error ? console.log(error) : console.log('success!');
                console.log(response);
            });
        }
        else if (data.action === "add a department"){
        }
        else if (data.action === "add a role"){
        }
        else if (data.action === "add an employee"){
        }
        else if (data.action === "update an employee role"){
            console.log("works")
        }
        else{
            console.log("quit");
            break;
        }
    }
    console.log('Goodbye!');
};


function promptUser(){
    const answers = inquirer.prompt([
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
