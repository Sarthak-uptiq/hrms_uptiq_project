API Documentation

This document provides detailed information about the API endpoints for the application. The base URL for all API calls is the gateway URL: http://localhost:3000.
1. Authentication Service (/api/auth)

This service handles user registration, login, and token verification.
1.1. POST /api/auth/register

Registers a new user. This is an HR-only action.

Request Body:

{
  "email": "employee@example.com",
  "role": "EMPLOYEE",
  "requestingUserId": "hr_user_id_string"
}

Description:

    email: (string, required) The email of the new employee.

    role: (string, required) The role of the new user. Can be "HR" or "EMPLOYEE".

    requestingUserId: (string, required) The user ID of the HR representative making the request.

Responses:

    201 Created: User created successfully.

    {
      "message": "User Created successfully"
    }

    409 Conflict: If a user with the given email already exists.

    {
      "success": false,
      "message": "User already exists"
    }

    404 Not Found: If the requestingUserId does not belong to a valid user.

    403 Forbidden: If the requestingUserId does not have the "HR" role.

1.2. POST /api/auth/login

Logs in an existing user.

Request Body:

{
  "email": "user@example.com",
  "password": "user_password",
  "role": "EMPLOYEE"
}

Description:

    email: (string, required) The user's email.

    password: (string, required) The user's password.

    role: (string, required) The role the user is attempting to log in as ("HR" or "EMPLOYEE").

Responses:

    201 Created: User logged in successfully. Sets an auth_token cookie.

    {
      "message": "User logged in successfully",
      "user": {
        "email": "user@example.com",
        "role": "EMPLOYEE",
        "user_id": "user_id_string"
      }
    }

    404 Not Found: If the user does not exist.

    401 Unauthorized: If the password is incorrect.

    409 Conflict: If the role provided does not match the user's role.

1.3. GET /api/auth/verify-token

Verifies the authentication token stored in the cookies.

Request Body:

None.

Responses:

    200 OK: Token is valid.

    {
      "user": {
        "email": "user@example.com",
        "id": "user_id_string",
        "role": "EMPLOYEE"
      }
    }

    401 Unauthorized: If the token is not found or is invalid.

2. HR Management Service (/api/hr)

This service handles HR-specific actions like managing employees, roles, and departments. All endpoints require the requester to be an HR user.
2.1. POST /api/hr/add-employee

Adds a new employee to the system and triggers registration in the auth service.

Request Body:

{
  "hr_email": "hr@example.com",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "city": "New York",
  "state": "NY",
  "pincode": "10001",
  "role_name": "Software Engineer",
  "dep_name": "Technology"
}

Responses:

    201 Created: Employee added successfully.

    403 Forbidden: If hr_email is not a valid HR user.

    404 Not Found: If role_name or dep_name do not exist.

2.2. PUT /api/hr/terminate-employee

Terminates an existing employee.

Request Body:

{
  "hr_email": "hr@example.com",
  "email": "employee_to_terminate@example.com"
}

Responses:

    200 OK: Employee terminated successfully.

    403 Forbidden: If hr_email is not a valid HR user.

2.3. GET /api/hr/get-all-employees

Retrieves a list of all employees.

Request Body:

None.

Responses:

    200 OK: Returns an array of all employee objects.

    {
      "employees": [
        {
          "emp_id": 1,
          "name": "Jane Doe",
          "email": "jane.doe@example.com",
          /* ... other fields */
        }
      ]
    }

2.4. POST /api/hr/add-department

Adds a new department.

Request Body:

{
  "hr_email": "hr@example.com",
  "dep_name": "New Department"
}

Responses:

    201 Created: Department added successfully.

    403 Forbidden: If hr_email is not a valid HR user.

2.5. POST /api/hr/add-role

Adds a new role with salary details.

Request Body:

{
  "hr_email": "hr@example.com",
  "role_name": "Senior Developer",
  "total_ctc": 120000,
  "base_salary": 90000,
  "bonus": 20000,
  "allowance": 10000
}

Responses:

    201 Created: Role added successfully.

    403 Forbidden: If hr_email is not a valid HR user.

3. Employee Details Service (/api/emp/details)

This service manages retrieving and updating individual employee details. Requires authentication.
3.1. GET /api/emp/details/get-all-details

Retrieves detailed information for a specific employee.

Request Body:

{
  "email": "employee@example.com"
}

Responses:

    200 OK: User found.

    {
      "message": "User found",
      "user": {
        "emp_id": 1,
        "name": "John Doe",
        "email": "john.doe@example.com",
        /* ... other details */
      }
    }

    404 Not Found: If no user is found with the provided email.

3.2. PUT /api/emp/details/update-emp-details

Updates one or more details for an employee.

Request Body:

{
  "existingEmail": "employee@example.com",
  "name": "John A. Doe",
  "city": "Boston",
  "state": "MA"
}

Description:

    existingEmail: (string, required) The email of the employee to update.

    Other fields are optional and will be updated if provided.

Responses:

    200 OK: User updated successfully.

    409 Conflict: If no update data is provided.

3.3. PUT /api/emp/details/update-emp-status or PUT /api/emp/details/ack-policies

Updates the employee's main status or their policy acknowledgement status. Both endpoints use the same controller.

Request Body:

{
  "email": "employee@example.com",
  "statusToUpdate": "EMP_STATUS",
  "status_flag": true
}

Description:

    email: (string, required) The employee's email.

    statusToUpdate: (string, required) The status to update. Can be EMP_STATUS or POLICY.

    status_flag: (boolean, required) The new value for the flag.

Responses:

    200 OK: Status updated successfully.
