const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table')
// create the connection information for the sql database
const pass = require("./pass")

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: pass,
    database: "cmsDB",
});

const start = () => {
    inquirer
    .prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View ALL Employees',
            'View All Employees By Department',
            'Add Employee',
            'Remove Employee',
            //'Update Employee Role',
            'End'
        ]
    })
    .then((answer) => {
        switch (answer.action) {
            case 'View ALL Employees':
                viewEmployeesAll();
                break;
            case 'View All Employees By Department':
                viewEmployeesByDep();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Remove Employee':
                removeEmployee();
                break;
            // case 'Update Employee Role':
            //     updateEmployeeRole();
            //     break;
            case 'End':
                connection.end();
            break;
        }
    });
}

// view all employees
const viewEmployeesAll = () => {
    console.log('\n')
    const query =
    `SELECT
    e.id,
    e.first_name,
    e.last_name,
    r.title,
    d.name AS department,
    r.salary,
    CONCAT (m.first_name, ' ', m.last_name) AS manager
    FROM employees e
    LEFT JOIN roles r
    ON e.role_id = r.id
    LEFT JOIN departments d
    ON d.id = r.department_id
    LEFT JOIN employees m
    ON m.id = e.manager_id;`

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    })
}

// view employees by department
const viewEmployeesByDep = () => {
    console.log('\n');
    const query =
    `SELECT
    d.id,
    d.name
    FROM employees e
    LEFT JOIN roles r 
    ON e.role_id = r.id
    LEFT JOIN departments d
    ON d.id = r.department_id
    GROUP BY d.id;`

    connection.query(query, (err, res) => {
        if (err) throw err;

        const departmentOptions = res.map(data => ({
            value: data.id, name: data.name
        }));

        //console.table(res);
        
        departmentPrompt(departmentOptions);
    });
}

const departmentPrompt = departmentOptions => {
    inquirer
    .prompt([
        {
            name: 'departmentByID',
            type: 'list',
            message: 'What department do you want to view?',
            choices: departmentOptions
        }
    ])
    .then((answer) => {
        const query =
        `SELECT
        e.id,
        e.first_name,
        e.last_name,
        r.title,
        d.name AS department
        FROM employees e
        JOIN roles r
        ON e.role_id = r.id
        JOIN departments d
        ON d.id = r.department_id
        WHERE d.id = ?;`

        connection.query(query, answer.departmentByID, (err, res) => {
            if (err) throw err;
            console.table(res);
            start();
        })
    })
}

// add employee
const addEmployee = () => {
    const query = "SELECT * FROM employees, roles";
    connection.query(query, (err, res) => {
        if (err) throw (err);

        inquirer
        .prompt([
            {
                name: "firstName",
                message: "Employee's first name:",
            },
            {
                name: "lastName",
                message: "Employee's last name:",
            },
            {
                name: "role",
                type: "list",
                message: "Employee's role:",
                choices: () => {
                    let roles = [];
                    for (let i = 0; i < res.length; i++) {
                        roles.push(res[i].title);
                    }
                    let choiceArr = [...new Set(roles)];
                    return choiceArr;
                },
            },
        ])
        .then((answer) => {
            let roleChoice;
            for (let i = 0; i < res.length; i++) {
                if (res[i].title === answer.role) {
                    roleChoice = res[i];
                }
            }

            const query = `INSERT INTO employees SET ?`
            connection.query(query, {
                first_name: answer.firstName,
                last_name: answer.lastName,
                role_id: roleChoice.id,
            }, (err, res) => {
                if(err) throw err;
                start();
            })
        })
    })
}

// delete employee
const removeEmployee = () => {
    const query = 
    `SELECT 
    e.id,
    e.first_name,
    e.last_name
    FROM employees e`

    connection.query(query, (err, res) => {
        if (err) throw err;
        const deleteOptions = res.map(({id, first_name, last_name}) => ({ value: id, name: `${first_name} ${last_name}`}));

        deleteEmployeePrompt(deleteOptions);
    });
}

const deleteEmployeePrompt = deleteOptions => {
    inquirer
    .prompt([
        {
            name: 'employeeID',
            type: 'list',
            message: 'Please select the employee you would like to remove',
            choices: deleteOptions
        }
    ])
    .then((answer) => {
        const query = `DELETE FROM employees WHERE ?`;
        connection.query(query, {id: answer.employeeID}, (err, res) => {
            if (err) throw err;
            console.log("Employee removed from CMS! \n");

            start();
        });
    });
};


// // update employee role
// const updateEmployeeRole = () => {
//     const query = 
//     `SELECT
//     e.id,
//     e.first_name,
//     e.last_name,
//     r.title,
//     d.name AS department,
//     r.salary,
//     CONCAT (m.first_name, ' ', m.last_name) AS manager
//     FROM employees e
//     LEFT JOIN roles r
//     ON e.role_id = r.id
//     LEFT JOIN departments d
//     ON d.id = r.department_id
//     LEFT JOIN employees m
//     ON m.id = e.manager_id;`

//     connection.query(query, (err, res) => {
//         if (err) throw err;

//         const employeeOptions = res.map(({id, first_name, last_name}) => ({vale: id, name: `${first_name} ${last_name}`}));

//         console.table(res);
//         roleUpdate(employeeOptions)
//     });
// }

// const roleUpdate = employeeOptions => {
//     const query = 
//     `SELECT r.id, r.title, r.salary FROM roles r`
//     let roleOptions;

//     connection.query(query, (err, res) => {
//         if (err) throw err;
//         roleOptions = res.map(({id, title, salary}) => ({value: id, title: `${title}`, salary: `${salary}`}));

//         console.table(res);
//         updateRolePrompt(employeeOptions, roleOptions)
//     })
// }

// const updateRolePrompt = (employeeOptions, roleOptions) => {
//     inquirer
//     .prompt([
//         {
//             name: 'employee_id',
//             type: 'list',
//             message: "Which employee's role do you want to update?",
//             choices: employeeOptions
//         },
//         {
//             name: 'role_id',
//             type: 'list',
//             message: "What role do you want to update it to?",
//             choices: roleOptions
//         }
//     ])
//     .then((answer) => {
//         const query = `UPDATE employees SET role_id = ? WHERE id = ?`
//         connection.query(query, [
//             answer.employee_id,
//             answer.role_id
//         ],
//         (err, res) => {
//             if(err) throw err;
//             console.table(res);
//             console.log("Updated!")
//             start();
//         })
//     })
// }

// connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    start();
});