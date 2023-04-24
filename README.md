# AWS-Project-Backend

## Database setup
- Clone the databse repo from the below mentioned link:
https://github.com/datacharmer/test_db/blob/master/employees.sql

- Run the databse on your system using he commands as follows:

	`mysql < employees.sql`

- You can test the installation by the following commands:

	`mysql -t < test_employees_md5.sql`

	OR

	`mysql -t < test_employees_sha.sql`

- Create a user table in the database using the following sql commands:

    `CREATE TABLE users (
        emp_no     INT    NOT NULL,
        role       ENUM ('manager', 'staff', 'senior engineer', 'engineer', 'assistant engineer', 'technique leader') NOT NULL,
        password   VARCHAR(255)   NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deletedAt TIMESTAMP DEFAULT NULL,
        KEY         (emp_no),
        FOREIGN KEY (emp_no) REFERENCES employees (emp_no) ON DELETE CASCADE,
        PRIMARY KEY (emp_no)
    );`

- Add the following data to the uswer table, using the below mentioned commands:

	`INSERT INTO users(emp_no, role, password) values(110183, 'manager', 'testpassword1');`

	`INSERT INTO users(emp_no, role, password) values(110022, 'manager', 'testpassword');`

	`INSERT INTO users(emp_no, role, password) values(10002, 'staff', 'testpassword1');`

- Create a database user for accessing the database from the application:

	`CREATE USER 'shortcut'@'localhost' IDENTIFIED BY 'password';`

- Add the `DB_USERNAME` and `DB_PASSWORD` properties in the `.env` file

## Install the backend

`npm install`

## Run the backend

`node app.js`

## Endpoints

1. POST `/login` 
    This endpoint gives you the jwt token which is used for authentication
    Sample user name and password json is given as follows in the request body

    `{
        "username": "10002",
        "password": "testpasswword"
    `}

    This gives the access token, in the following format:

    `{
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwMDAyLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE2ODIyNjMxNDUsImV4cCI6MTY4MjI3MDM0NX0.SFW0PPc1gjHxMwg1fAgd5G_SqrKI9_c7uBZD8ae0uH8"
    }`

    The JWT is as follows:

    `{
        "sub": 110022, // emp_no
        "role": "manager", // role of logged in user
        "iat": 1682258309, // issued at
        "exp": 1682265509 // expires at
    }`

	**NOTE:** For JWT_KEY please create a .env file in the root folder with JWT_KEY="SomeRandomKey" for the backend to work.

2. GET `/employee/:id/salaries`

    Use the above generated accessToken to get the employee Salaries.Following json will be returned.
    
    `[
        {
            "emp_no": 10002,
            "salary": 65828,
            "from_date": "1996-08-03",
            "to_date": "1997-08-03"
        },
        {
            "emp_no": 10002,
            "salary": 65909,
            "from_date": "1997-08-03",
            "to_date": "1998-08-03"
        },
    ]`

	**NOTE:** For JWT_KEY please create a .env file in the root folder with JWT_KEY="SomeRandomKey" for the backend to work. The Users in the users table with dedicated role as `Managers` will have the privileges of accessing any employees salaries. Other than that every employee will have the access to its own information including his respective salary.

3. GET `/employee/:id`

    Use the above generated accessToken to get the employee information.Following json will be returned.

    `[
        {
            "employeeNumber": "10002",
            "birth_date": "1964-06-02",
            "first_name": "Bezalel",
            "last_name": "Simmel",
            "gender": "F",
            "hire_date": "1985-11-21"
        },
    ]`

	**NOTE:** This endpoint is also access restricted, every employee will be able to see only his information.
