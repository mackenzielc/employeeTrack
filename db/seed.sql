-- departments
INSERT INTO departments (name)
VALUES("Sales"), ("Finance"), ("Legal"), ("Engineering");

-- roles
INSERT INTO roles (title, salary, department_id)
VALUES("Sales Lead", 100000, 1), ("Salesperson", 60000, 1);

INSERT INTO roles (title, salary, department_id)
VALUES("Accountant", 100000, 2);

INSERT INTO roles (title, salary, department_id)
VALUES("Lawyer", 150000, 3);

INSERT INTO roles (title, salary, department_id)
VALUES("Lead Engineer", 200000, 4), ("Software Engineer", 120000, 4);


-- employees
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES("John", "Doe", 1, null),
("Mike", "Chan", 2, 1),
("Ashley", "Rodrigues", 3, null),
("Malia", "Brown", 4, null),
("Kevin", "Tupik", 5, null),
("Sarah", "Lourd", 6, 5)