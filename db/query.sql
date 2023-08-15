
SELECT e.id, e.first_name, e.last_name, roles.title, departments.department_name AS department, roles.salary, m.id AS managerID, CONCAT(m.first_name, ' ', m.last_name) AS manager
FROM departments
LEFT JOIN roles
ON department_id = departments.id
LEFT JOIN employees e
ON role_id = roles.id
LEFT JOIN employees m
on (e.manager_id = m.id)
WHERE e.id IS NOT NULL
ORDER BY e.id;

SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS manager
FROM employees
WHERE employees.manager_id IS NULL;

SELECT m.id AS managerID 
FROM roles
LEFT JOIN employees e
ON role_id = roles.id
LEFT JOIN employees m
ON (e.manager_id = m.id)
WHERE e.id IS NOT NULL
ORDER BY roles.id;
