const inquirer = require('inquirer');
const { db } = require('./db.js');

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
    console.log("hello2");
    inquirer
      .prompt([
        {
          type: 'checkbox',
          name: 'choices',
          message: 'What would you like to do?',
          choices: [this.option1, this.option2, this.option3, this.option4, this.option5, this.option6, this.option7],
        }
      ])
      .then(({choices}) => {
        console.log("hello2");
        if (choices === this.option1) {
          return this.runOption1();
        } else if (choices === this.option2) {
          return this.runOption2();
        } else if (choices === this.option3) {
          return this.runOption3();
        } else if (choices === this.option4) {
          return this.runOption4();
        } else if (choices === this.option5) {
          return this.runOption5();
        } else if (choices === this.option6) {
          return this.runOption6();
        } else if (choices === this.option7) {
          return this.runOption7();
        }
      })
      .catch((err) => {
        console.log(err);
        console.log('Oops. Something went wrong.');
      });
  }

  runOption1() {
    const sql = `SELECT departments.id, departments.department_name AS Department FROM departments;`;
    db.query(sql, (err, results) => {
      if (err) {
        console.log('Oops. Something went wrong. Check your database.');
        return;
      }
      console.table(results);
    });
  }
  
  runOption2() {
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
      console.table(results);
    });
  }
  
  runOption3() {
    const sql = `SELECT e.id, e.first_name, e.last_name, roles.title, departments.department_name AS department, roles.salary, m.id AS managerID, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM departments
    LEFT JOIN roles
    ON department_id = departments.id
    LEFT JOIN employees e
    ON role_id = roles.id
    LEFT JOIN employees m
    ON (e.manager_id = m.id)
    WHERE e.id IS NOT NULL
    ORDER BY e.id;`;
    db.query(sql, (err, results) => {
      if (err) {
        console.log('Oops. Something went wrong. Check your database.');
        return;
      }
      console.table(results);
    });
  }
  
  runOption4() {
    return inquirer
      .prompt([
        {
          type: 'input',
          name: 'add_department',
          message: 'What is the name of the department?',
        }
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
  
  runOption5() { 
    let departmentArray = [];
    let i = 0;
    const sql1 = `SELECT departments.department_name FROM departments;`;
    db.query(sql1, (err, results) => {
      if (err) {
        console.log('Oops. Something went wrong. Check your database.');
        return;
      }
      for (k=0; k<results.length; k++) {
        if (k == 0) {
          departmentArray[0] = results[0].department_name;
        } else {
          departmentArray.push(results[k].department_name);
        }
      }
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
          choices: departmentArray,
        }
      ])
      .then(({ add_role, add_salary, deptTable }) => {
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
  
  runOption6() { 
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
      for (k=0; k<results.length; k++) {
        if (k == 0) {
          roleArray[0] = results[0].title;
        } else {
          roleArray.push(results[k].title);
        }
      }
    });
    const sql2 = `SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS manager
    FROM employees
    WHERE employees.manager_id IS NULL;`;
    db.query(sql2, (err, results) => {
      if (err) {
        console.log('Oops. Something went wrong. Check your database.');
        return;
      }
      for (k=0; k<results.length; k++) {
        if (k == 0) {
          managerArray[0] = results[0].manager;
        } else {
          managerArray.push(results[k].manager);
        }
      }
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
          choices: roleArray,
        },
        {
          type: 'checkbox',
          name: 'managerTable',
          message: 'Who is the employees manager?',
          choices: managerArray,
        }
      ])
      .then(({ add_firstName, add_lastName, roleTable, managerTable }) => {
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
  
  runOption7() { 
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
      for (k=0; k<results.length; k++) {
        if (k == 0) {
          emArray[0] = results[0].employee;
        } else {
          emArray.push(results[k].employee);
        }
      }
    });
    const sql2 = `SELECT roles.title FROM roles;`;
    db.query(sql2, (err, results) => {
      if (err) {
        console.log('Oops. Something went wrong. Check your database.');
        return;
      }
      for (k=0; k<results.length; k++) {
        if (k == 0) {
          roleArray[0] = results[0].title;
        } else {
          roleArray.push(results[k].title);
        }
      }
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
      for (k=0; k<results.length; k++) {
        if (k == 0) {
          managerArray[0] = results[0].managerID;
        } else {
          managerArray.push(results[k].managerID);
        }
      }
    });
    return inquirer
      .prompt([
        {
          type: 'checkbox',
          name: 'emTable',
          message: 'Select an employee',
          choices: emArray,
        },
        {
          type: 'checkbox',
          name: 'roleTable',
          message: 'What is the employees new role?',
          choices: roleArray,
        }
      ])
      .then(({ emTable, roleTable }) => {
        i = emArray.indexOf(emTable) + 1;
        j = roleArray.indexOf(roleTable) + 1;
        k = parseInt(managerArray[j]);
        const sql4 = `UPDATE employees
        SET employees.role_id = ${j}, manager_id = ${k}
        WHERE employees.id = ${i};`;
        db.query(sql4, (err, results) => {
          if (err) {
            console.log('Oops. Something went wrong. Check your database.');
            return;
          }
          console.log('employees role updated.');
        });
      });
  }
}

module.exports = CLI;
