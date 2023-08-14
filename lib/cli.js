const inquirer = require('inquirer');
const { db } = require('./db');

class CLI {
  
  run() {
    console.log("hello2");
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'prompt',
          message: 'What would you like to do?',
          choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update employee role'],
        }
      ])
      .then((answers) => {
        console.log(answers);
        if (answers.prompt === 'view all departments') {
          console.log("hello3");
          return this.runOption1();
        } else if (answers.prompt === 'view all roles') {
          return this.runOption2();
        } else if (answers.prompt === 'view all employees') {
          return this.runOption3();
        } else if (answers.prompt === 'add a department') {
          return this.runOption4();
        } else if (answers.prompt === 'add a role') {
          return this.runOption5();
        } else if (answers.prompt === 'add an employee') {
          return this.runOption6();
        } else if (answers.prompt === 'update employee role') {
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
      this.run();
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
      this.run();
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
      this.run();
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
        console.log(add_department);
        const sql = `INSERT INTO departments (department_name) VALUE ("${add_department}")`;
        db.query(sql, (err, results) => {
          if (err) {
            console.log('Oops. Something went wrong. Check your database.');
            return;
          }
          console.log('new department added.');
          this.run();
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
      } else {
        for (let k=0; k < results.length; k++) {
          if (k == 0) {
            departmentArray[0] = results[0].department_name;
          } else {
            departmentArray.push(results[k].department_name);
          }
        }
      inquirer
      .prompt([
        {
          type: 'input',
          name: 'add_role',
          message: 'What is the name of the role?',
        },
        {
          type: 'input',
          name: 'add_salary',
          message: 'What is the salary of the new role?',
        },
        {
          type: 'list',
          name: 'deptTable',
          message: 'Which department does this role belong to?',
          choices: departmentArray,
        }
      ])
      .then(({ add_role, add_salary, deptTable }) => {
        i = departmentArray.indexOf(deptTable) + 1;
        console.log(i);
        const sql2 = `INSERT INTO roles (title, salary, department_id) VALUE ("${add_role}", ${add_salary}, ${i})`;
        db.query(sql2, (err, results) => {
          if (err) {
            console.log('Oops. Something went wrong. Check your database.');
            return;
          } else if (add_salary == NaN) {
            console.log('Please enter a numerical value.');
            return;
          }
          console.log('new role added.');
          this.run();
        });
      });
      }
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
      for (let k=0; k<results.length; k++) {
        if (k == 0) {
          roleArray[0] = results[0].title;
        } else {
          roleArray.push(results[k].title);
        }
      }
      console.log(roleArray);
    });
    const sql2 = `SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS manager
    FROM employees
    WHERE employees.manager_id IS NULL;`;
    db.query(sql2, (err, results) => {
      if (err) {
        console.log('Oops. Something went wrong. Check your database.');
        return;
      }
      for (let k=0; k<results.length; k++) {
        if (k == 0) {
          managerArray[0] = results[0].manager;
        } else {
          managerArray.push(results[k].manager);
        }
      }
      console.log(managerArray);
      inquirer
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
          type: 'list',
          name: 'roleTable',
          message: 'What is the employees role?',
          choices: roleArray,
        },
        {
          type: 'list',
          name: 'managerTable',
          message: 'Who is the employees manager?',
          choices: managerArray,
        }
      ])
      .then(({ add_firstName, add_lastName, roleTable, managerTable }) => {
        i = roleArray.indexOf(roleTable) + 1;
        j = managerArray.indexOf(managerTable) + 1;
        const sql3 = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUE ("${add_firstName}", "${add_lastName}", ${i}, ${j})`;
        db.query(sql3, (err, results) => {
          if (err) {
            console.log('Oops. Something went wrong. Check your database.');
            return;
          }
          console.log('new employee added.');
          this.run();
        });
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
      for (let k=0; k<results.length; k++) {
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
      for (let k=0; k<results.length; k++) {
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
      for (let k=0; k<results.length; k++) {
        if (k == 0) {
          managerArray[0] = results[0].managerID;
        } else {
          managerArray.push(results[k].managerID);
        }
      }
      inquirer
      .prompt([
        {
          type: 'list',
          name: 'emTable',
          message: 'Select an employee',
          choices: emArray,
        },
        {
          type: 'list',
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
          this.run();
        });
      });
    });

  }
}

module.exports = CLI;
