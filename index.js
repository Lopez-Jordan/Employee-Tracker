const mysql = require('mysql2');
const inquirer = require('inquirer');

init();

async function init(){
    while (true){
        let data = await promptUser();
        if(data.action === "quit"){
            break;
        }
        else if (data.action === "view all departments"){
            // do something
        }
        else if (data.action === "view all roles"){
            // do something 
        }
        else if (data.action === "view all employees"){
            // do something
        }
        else if (data.action === "add a department"){
            // do something
        }
        else if (data.action === "add a role"){
            // do asdfasdf
        }
        else if (data.action === "add an employee"){

        }
        else{
            // "update an employee role"
        }
    
            

    
    
    }
    console.log('Goodbye!');
};



// prompt user
// use that data and perform some sort of action in the db
//