-- Insert departments
INSERT INTO department (name)
VALUES 
    ('sales'), 
    ('engineering'), 
    ('R&D');

-- Insert roles
INSERT INTO role (title, salary, department_id)
VALUES
    ('Junior Sales', 50000, 1),
    ('Front End Dev', 100000, 2),
    ('Back End Dev', 100000, 2),
    ('Researcher', 70000, 3),
    ('Developer', 70000, 3);

-- Insert employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Jordan', 'Lopez', 2, NULL),
    ('Jake', 'Lopez', 1, 1),
    ('Eamon', 'Niknafs', 3, 1),
    ('Ryan', 'Frederich', 5, 1),
    ('Dylan', 'Do', 2 , 1);

