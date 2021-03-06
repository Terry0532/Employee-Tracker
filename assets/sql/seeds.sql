INSERT INTO department (name) VALUES
    ("Sales"),
    ("Engineering"),
    ("Finance"),
    ("Legal");

INSERT INTO role (title, salary, department_id, management) VALUES
    ("Sales Lead", 101542.78, 1, 1),
    ("Salesperson", 88754.12, 1, 0),
    ("Lead Engineer", 155678.99, 2, 1),
    ("Software Engineer", 121457.97, 2, 0),
    ("Accountant", 125598.15, 3, 0),
    ("Lawyer", 198957.57, 4, 0),
    ("Legal Team Lead", 256791.12, 4, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
    ("Braydon", "Foster", 1, null),
    ("Sheena", "Trujillo", 2, 1),
    ("Elleanor", "Navarro", 3, null),
    ("Aniyah", "Brewer", 4, 3),
    ("Jez", "Spears", 5, null),
    ("Charlton", "Dowling", 6, 7),
    ("Adrianna", "Mohamed", 7, null),
    ("Aiden", "Ramsey", 2, 1);