const inquirer = require('inquirer');
const { db } = require('./db.js');

function runOption1() {
  const sql = `SELECT departments.id, departments.department_name AS Department FROM departments;`;
  db.query(sql, (err, results) => {
    if (err) {
      console.log('Oops. Something went wrong. Check your database.');
      return;
    }
    console.log(results);
  });
}

function runOption2() {
  const sql = `SELECT roles.id, roles.title, departments.department_name AS department, roles.salary
  FROM departments
  LEFT JOIN roles
  ON department_id = departments.id
  ORDER BY roles.id;`;
  db.query(sql, (err, results) => {
    if (err) {
      console.log('Oops. Something went wrong. Check your database.');
      return;
    }
    console.log(results);
  });
}

function runOption3() {
  const sql = `SELECT e.id, e.first_name, e.last_name, roles.title, departments.department_name AS department, roles.salary, m.id AS managerID, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM departments
  LEFT JOIN roles
  ON department_id = departments.id
  LEFT JOIN employees e
  ON role_id = roles.id
  LEFT JOIN employees m
  on (e.manager_id = m.id)
  WHERE e.id IS NOT NULL
  ORDER BY e.id;`;
  db.query(sql, (err, results) => {
    if (err) {
      console.log('Oops. Something went wrong. Check your database.');
      return;
    }
    console.log(results);
  });
}

function runOption4() {
  return inquirer
    .prompt([
      {
        type: 'input',
        name: 'add_department',
        message: 'What is the name of the department?',
      },
    ])
    .then(({ add_department }) => {
      const sql = `INSERT INTO departments (department_name) VALUE (${add_department})`;
      db.query(sql, (err, results) => {
        if (err) {
          console.log('Oops. Something went wrong. Check your database.');
          return;
        }
        console.log('new department added.');
      });
    });
}

function runOption5() { 
  let departmentArray = [];
  let i = 0;
  const sql1 = `SELECT departments.department_name FROM departments;`;
  db.query(sql1, (err, results) => {
    if (err) {
      console.log('Oops. Something went wrong. Check your database.');
      return;
    }
    departmentArray = results;
    console.log(results);
    console.log(typeof(results));
    console.log(results.department_name);
    console.log(typeof(results.department_name));
  });
  return inquirer
    .prompt([
      {
        type: 'input',
        name: 'add_role',
        message: 'What is the name of the department?',
      },
      {
        type: 'input',
        name: 'add_salary',
        message: 'What is the name of the department?',
      },
      {
        type: 'checkbox',
        name: 'deptTable',
        message: 'Which department does this role belong to?',
        choices: [departmentArray],
      },
    ])
    .then(({ add_role, add_salary, deptTable}) => {
      i = resultsArray.indexOf(deptTable) + 1;
      const sql2 = `INSERT INTO roles (title, salary, department_id) VALUE (${add_role}, ${add_salary}, ${i})`;
      db.query(sql2, (err, results) => {
        if (err) {
          console.log('Oops. Something went wrong. Check your database.');
          return;
        } else if (add_salary == NaN) {
          console.log('Please enter a numerical value.');
          return;
        }
        console.log('new role added.');
      });
    });
}

function runOption6() { 
  let roleArray = [];
  let managerArray = [];
  let i = 0;
  let j = 0;
  const sql1 = `SELECT roles.title FROM roles;`;
  db.query(sql1, (err, results) => {
    if (err) {
      console.log('Oops. Something went wrong. Check your database.');
      return;
    }
    roleArray.push(results);
    console.log(results);
    console.log(typeof(results));
    console.log(results.title);
    console.log(typeof(results.title));
  });
  const sql2 = `SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS manager
  FROM employees
  WHERE employees.manager_id IS NULL;`;
  db.query(sql2, (err, results) => {
    if (err) {
      console.log('Oops. Something went wrong. Check your database.');
      return;
    }
    managerArray.push(results);
  });
  return inquirer
    .prompt([
      {
        type: 'input',
        name: 'add_firstName',
        message: 'What is the employees first name?',
      },
      {
        type: 'input',
        name: 'add_lastName',
        message: 'What is the employees last name?',
      },
      {
        type: 'checkbox',
        name: 'roleTable',
        message: 'What is the employees role?',
        choices: [roleArray],
      },
      {
        type: 'checkbox',
        name: 'managerTable',
        message: 'Who is the employees manager?',
        choices: [managerArray],
      },
    ])
    .then(({ add_firstName, add_lastName, roleTable, managerTable}) => {
      i = roleArray.indexOf(roleTable) + 1;
      j = managerArray.indexOf(managerTable) + 1;
      const sql3 = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUE (${add_firstName}, ${add_lastName}, ${i}, ${j})`;
      db.query(sql3, (err, results) => {
        if (err) {
          console.log('Oops. Something went wrong. Check your database.');
          return;
        }
        console.log('new employee added.');
      });
    });
}

function runOption7() { 
  let emArray = [];
  let roleArray = [];
  let managerArray = [];
  let i = 0;
  let j = 0;
  const sql1 = `SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS employee FROM employees;`;
  db.query(sql1, (err, results) => {
    if (err) {
      console.log('Oops. Something went wrong. Check your database.');
      return;
    }
    emArray.push(results);
    console.log(results);
    console.log(typeof(results));
    console.log(results.title);
    console.log(typeof(results.title));
  });
  const sql2 = `SELECT roles.title FROM roles;`;
  db.query(sql2, (err, results) => {
    if (err) {
      console.log('Oops. Something went wrong. Check your database.');
      return;
    }
    roleArray.push(results);
  });
  const sql3 = `SELECT m.id AS managerID 
  FROM roles
  LEFT JOIN employees e
  ON role_id = roles.id
  LEFT JOIN employees m
  ON (e.manager_id = m.id)
  WHERE e.id IS NOT NULL
  ORDER BY roles.id;`;
  db.query(sql3, (err, results) => {
    if (err) {
      console.log('Oops. Something went wrong. Check your database.');
      return;
    }
    managerArray.push(results);
  });
  return inquirer
    .prompt([
      {
        type: 'checkbox',
        name: 'emTable',
        message: 'Select an employee',
        choices: [emArray],
      },
      {
        type: 'checkbox',
        name: 'roleTable',
        message: 'What is the employees new role?',
        choices: [roleArray],
      },
    ])
    .then(({ emTable, roleTable }) => {
      i = emArray.indexOf(emTable) + 1;
      j = roleArray.indexOf(roleTable) + 1;
      k = parseInt(managerArray[j]);
      const sql3 = `UPDATE employees
      SET employees.role_id = ${j}, manager_id = ${k}
      WHERE employees.id = ${i};`;
      db.query(sql3, (err, results) => {
        if (err) {
          console.log('Oops. Something went wrong. Check your database.');
          return;
        }
        console.log('employees role updated.');
      });
    });
}

class CLI {
  constructor() {
    this.option1 = 'view all departments';
    this.option2 = 'view all roles';
    this.option3 = 'view all employees';
    this.option4 = 'add a department';
    this.option5 = 'add a role';
    this.option6 = 'add an employee';
    this.option7 = 'update employee role'
  }
  
  run() {
    console.log("hello");
    return inquirer
      .prompt([
        {
          type: 'checkbox',
          name: 'choices',
          message: 'What would you like to do?',
          choices: [this.option1, this.option2, this.option3, this.option4, this.option5, this.option6],
        },
      ])
      .then(({choices}) => {
        console.log("hello");
        if (choices[0] == this.option1) {
          return runOption1();
        } else if (choices[0] == this.option2) {
          return runOption2();
        } else if (choices[0] == this.option3) {
          return runOption3();
        } else if (choices[0] == this.option4) {
          return runOption4();
        } else if (choices[0] == this.option5) {
          return runOption5();
        } else if (choices[0] == this.option6) {
          return runOption6();
        } else if (choices[0] == this.option7) {
          return runOption7();
        }
      })
      .catch((err) => {
        console.log(err);
        console.log('Oops. Something went wrong.');
      });
  }
}

module.exports = CLI;