const mysql = require('mysql2');
const inquirer = require('inquirer');

init();

async function init(){
    while (true){
        let data = await promptUser();
        console.log(data);
        if(data.action === "quit"){
            break;
        }
        else if (data.action === "view all departments"){
            console.log("works");
        }
        else if (data.action === "view all roles"){
            console.log("works");
        }
        else if (data.action === "view all employees"){
            console.log("works");
        }
        else if (data.action === "add a department"){
            console.log("works");
        }
        else if (data.action === "add a role"){
            console.log("works");
        }
        else if (data.action === "add an employee"){
            console.log("works");
        }
        else if (data.action === "update an employee role"){
            console.log("works")
        }
        else{
            console.log("quit");
        }
    
            

    
    
    }
    console.log('Goodbye!');
};


async function promptUser(){
    const answers = await inquirer.prompt([
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
// prompt user
// use that data and perform some sort of action in the db
//