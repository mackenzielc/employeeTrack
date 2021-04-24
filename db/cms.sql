DROP DATABASE IF EXISTS cmsDB;
CREATE database cmsDB;

USE cmsDB;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NULL,
    PRIMARY KEY (id)
);

SELECT * FROM departments;
SELECT * FROM roles;
SELECT * FROM employees;

SELECT
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
ON m.id = e.manager_id;