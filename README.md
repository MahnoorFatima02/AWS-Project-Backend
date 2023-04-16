# AWS-Project-Backend

## Install the backend

`npm install`

## Run the backend

`node app.js`

## Endpoints

1. POST `/login` 
    This endpoint gives you the jwt token which is used for authentication
    Sample user name and password json is given as follows in the request body

    `{
        "username": "john",
        "password": "password123admin"
    `}


2. GET `/employeeSalaries` 

    Use the above generated accessToken to get the employee Salaries.Following json will be returned. 
    
    `[
        {
            "employeeNumber": "1234",
            "salary": "4000",
            "department": "HR"
        },
        {
            "employeeNumber": "1254",
            "salary": "4020",
            "department": "HR"
        },
        {
            "employeeNumber": "1237",
            "salary": "4100",
            "department": "HR"
        }
    ]`

NOTE: For JWT_KEY please create a .env file in the root folder with JWT_KEY="SomeRandomKey" for the backend to work. 
