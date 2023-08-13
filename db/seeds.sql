INSERT INTO departments (department_name)
VALUES ("Finance"),
       ("IT"),
       ("Production"),
       ("Design"),
       ("Marketing");

INSERT INTO roles (id, title, salary, department_id)
VALUES (1, "Design Manager", 150000.00, 4),
       (2, "Finance Manager", 180000.00, 1),
       (3, "IT Manager", 180000.00, 2),
       (4, "Production Manager", 150000.00, 3),
       (5, "Marketing Manager", 150000.00, 5),
       (6, "Graphic Designer", 100000.00, 4),
       (7, "Accountant", 90000.00, 1),
       (8, "IT Support Engineer", 100000.00, 2),
       (9, "IT Network Engineer", 120000.00, 2),
       (10, "Warehouse Operator", 60000.00, 3),
       (11, "Machine Operator", 70000.00, 3),
       (12, "Sales Engineer", 10000.00, 5);

INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Anna", "Blake", 1, 1),
       (2, "Tony", "Ryan", 2, 2),
       (3, "Tom", "James", 3, 3),
       (4, "Nathan", "Rose", 4, 4),
       (5, "Patrice", "Newman", 5, 5),
       (6, "Con", "Stanly", 6, 1),
       (7, "Darren", "Carpenter", 7, 2),
       (8, "Maggie", "Warren", 8, 3),
       (9, "Michelle", "Li", 9, 3),
       (10, "Adrian", "Connelly", 10, 4),
       (11, "Will", "Chan", 11, 4),
       (12, "Crystal", "Singh", 12, 5);
       
