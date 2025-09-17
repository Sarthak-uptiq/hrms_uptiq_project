# Employee Service API Documentation

This service manages employee data, organizational structure (roles, departments), and HR-specific operations. The API is divided into two main parts:

1.  **Employee Details API**: Endpoints for employees to manage their own personal information.
2.  **HR Admin API**: Endpoints for users with an HR role to manage the entire workforce, including adding employees, defining roles, and managing departments.

---

## Authentication

All endpoints in this service are protected and require authentication. The `authenticateRequest` middleware is applied to all routes, which is expected to verify a token and populate a `req.userEmail` property on the request object. This email is used to identify the user making the request.

Most HR Admin API endpoints are further protected by a `validateHR` middleware, which ensures that the authenticated user has the permissions of an HR representative.

---

## Data Models

### `employee` Model

Represents an individual employee in the database.

| Field | Type | Description |
| :--- | :--- | :--- |
| `emp_id` | String | Unique ID (UUID) for the employee. |
| `name` | String | Employee's full name. |
| `email` | String | Employee's unique email address. |
| `city` | String? | Optional: City of residence. |
| `state` | String? | Optional: State of residence. |
| `pincode` | String? | Optional: Pincode of residence. |
| `dep_id` | Int | Foreign key for the `department`. |
| `role_id` | Int | Foreign key for the `role`. |
| `status` | Enum | `ACTIVE`, `INACTIVE`, `TERMINATED`. |
| `policy_ack_status` | Enum | `ACKNOWLEDGED`, `PENDING`. |
| `createdAt` | DateTime | Timestamp of when the employee was added. |

### `department` Model

Represents an organizational department.

| Field | Type | Description |
| :--- | :--- | :--- |
| `dep_id` | Int | Unique ID (auto-increment) for the department. |
| `dep_name` | String | Unique name of the department. |
| `employees` | `employee[]` | Relation to employees in this department. |

### `role` Model

Represents a job role and its compensation.

| Field | Type | Description |
| :--- | :--- | :--- |
| `role_id` | Int | Unique ID (auto-increment) for the role. |
| `role_name` | String | Unique name of the role. |
| `total_ctc` | Float | Total Cost to Company. |
| `base_salary` | Float | Base salary component. |
| `bonus` | Float | Bonus component. |
| `allowance` | Float | Allowance component. |
| `employees` | `employee[]` | Relation to employees with this role. |

---

## Employee Details API

These endpoints are for an authenticated employee to manage their *own* data.

### 1. Get Employee Details

* **`GET /get-all-details`**
* **Description:** Fetches the complete profile for the authenticated user, including their role and department information.
* **Authentication:** Required. Uses `req.userEmail` to find the user.
* **Success Response (200):**
    ```json
    {
      "message": "User found",
      "user": {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "city": "Anytown",
        "state": "Anystate",
        "pincode": "12345",
        "status": "ACTIVE",
        "policy_ack_status": "PENDING",
        "department": {
          "dep_name": "Engineering"
        },
        "role": {
          "role_name": "Software Engineer",
          "total_ctc": 100000,
          "base_salary": 70000,
          "bonus": 20000,
          "allowance": 10000
        }
      }
    }
    ```
* **Error Responses:**
    * `401 Unauthorized`: "Unauthorized: No token provided"
    * `404 Not Found`: "No user found"

### 2. Update Employee Details

* **`PUT /update-emp-details`**
* **Description:** Updates the personal details (name, city, state, pincode) for the authenticated user.
* **Authentication:** Required. Uses `req.userEmail` to find the user.
* **Middleware:** `validateUpdateRequest` (Validates against `UpdateEmpInputSchema`).
* **Request Body (`UpdateEmpInputSchema`):**
    ```json
    {
      "name": "Johnathan Doe",
      "city": "New City",
      "state": "New State",
      "pincode": "54321"
    }
    ```
* **Success Response (200):**
    ```json
    {
      "message": "User updated",
      "user": { ... } // Full updated employee object
    }
    ```
* **Error Responses:**
    * `401 Unauthorized`: "Unauthorized: No token provided"

### 3. Update Employee Status or Policy Acknowledgement

* **`PUT /update-emp-status`**
* **`PUT /ack-policies`**
* **Description:** Both routes use the same controller (`updateFlags`) to update a specific flag on the employee's profile.
    * `/update-emp-status` is used to change the `status` field.
    * `/ack-policies` is used to change the `policy_ack_status` field.
* **Authentication:** Required. Uses `req.userEmail` to find the user.
* **Middleware:** `validateEmpStatus` (Validates against `UpdateEmpStatus`).
* **Request Body (`UpdateEmpStatusType`):**
    ```json
    // Example for /update-emp-status
    {
      "statusToUpdate": "EMP_STATUS",
      "status_flag": "INACTIVE" // or "ACTIVE"
    }
    
    // Example for /ack-policies
    {
      "statusToUpdate": "POLICY",
      "status_flag": "ACK" // or "NOT_ACK"
    }
    ```
* **Success Response (200):**
    ```json
    {
      "message": "updated emp status: [POLICY/EMP_STATUS] to [user_object]"
    }
    ```
* **Error Responses:**
    * `401 Unauthorized`: "Unauthorized: No token provided"
    * `404 Not Found`: "No body found"

---

## HR Admin API

These endpoints are for users with an HR role to manage employees, departments, and roles.

### Employee Management

#### 1. Add Employee

* **`POST /add-employee`**
* **Description:** Creates a new employee record in the system.
* **Authentication:** HR Role Required.
* **Request Body (`addEmployeeSchema`):**
    ```json
    {
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "city": "Anytown",
      "state": "Anystate",
      "pincode": "12345",
      "role_id": 1,
      "dep_id": 1
    }
    ```
* **Side Effects:** Publishes an `employee.created` message to RabbitMQ with the employee's email, role, user ID, and the requesting HR user's ID.
* **Success Response (201):**
    ```json
    {
      "message": "Employee added",
      "employee": { ... } // New employee object
    }
    ```
* **Error Responses:**
    * `403 Forbidden`: "Unauthorized: Not HR"
    * `404 Not Found`: "Role or Department not found" or "HR user not found"

#### 2. Terminate Employee

* **`PUT /terminate-employee`**
* **Description:** Updates an employee's status to `TERMINATED`.
* **Authentication:** HR Role Required.
* **Request Body (`terminateEmployeeSchema`):**
    ```json
    {
      "email": "jane.doe@example.com",
      "reason": "Voluntary resignation"
    }
    ```
* **Success Response (200):**
    ```json
    {
      "message": "Employee terminated",
      "employee": { ... } // Updated employee object
    }
    ```
* **Error Responses:**
    * `403 Forbidden`: "Unauthorized: Not HR"

#### 3. Get All Employees

* **`GET /get-all-employees`**
* **Description:** Retrieves a list of all employees, including their full department and role details.
* **Authentication:** HR Role Required.
* **Success Response (200):**
    ```json
    {
      "employees": [
        {
          "emp_id": "uuid-...",
          "name": "John Doe",
          "email": "john.doe@example.com",
          "city": "Anytown",
          "state": "Anystate",
          "pincode": "12345",
          "dep_id": 1,
          "role_id": 1,
          "status": "ACTIVE",
          "policy_ack_status": "PENDING",
          "createdAt": "2023-01-01T00:00:00.000Z",
          "department": { "dep_name": "Engineering" },
          "role": {
            "role_name": "Software Engineer",
            "total_ctc": 100000,
            "base_salary": 70000,
            "bonus": 20000,
            "allowance": 10000
          }
        }
      ]
    }
    ```

### Department Management

#### 1. Add Department

* **`POST /add-department`**
* **Description:** Creates a new department.
* **Authentication:** HR Role Required.
* **Request Body (`addDepartmentSchema`):**
    ```json
    {
      "dep_name": "Marketing"
    }
    ```
* **Success Response (201):**
    ```json
    {
      "message": "Department added",
      "department": {
        "dep_id": 2,
        "dep_name": "Marketing"
      }
    }
    ```
* **Error Responses:**
    * `403 Forbidden`: "Unauthorized: Not HR"

#### 2. Get All Departments

* **`GET /get-all-departments`**
* **Description:** Retrieves a list of all available departments.
* **Authentication:** HR Role Required.
* **Success Response (200):**
    ```json
    {
      "departments": [
        { "dep_id": 1, "dep_name": "Engineering" },
        { "dep_id": 2, "dep_name": "Marketing" }
      ]
    }
    ```

#### 3. Edit Department

* **`PUT /edit-department/:dep_id`**
* **Description:** Updates the name of a specific department.
* **Authentication:** HR Role Required.
* **URL Parameters:**
    * `dep_id` (integer): The ID of the department to edit.
* **Request Body (`editDepartmentSchema`):**
    ```json
    {
      "dep_name": "Digital Marketing"
    }
    ```
* **Success Response (200):**
    ```json
    {
      "message": "Department updated",
      "department": {
        "dep_id": 2,
        "dep_name": "Digital Marketing"
      }
    }
    ```
* **Error Responses:**
    * `400 Bad Request`: "Invalid department ID"
    * `403 Forbidden`: "Unauthorized: Not HR"

### Role Management

#### 1. Add Role

* **`POST /add-role`**
* **Description:** Creates a new job role and its associated compensation structure.
* **Authentication:** HR Role Required.
* **Request Body (`addRoleSchema`):**
    ```json
    {
      "role_name": "Senior Engineer",
      "total_ctc": 150000,
      "base_salary": 100000,
      "bonus": 30000,
      "allowance": 20000
    }
    ```
* **Side Effects:** Publishes a `role.created` message to RabbitMQ with the new role object.
* **Success Response (201):**
    ```json
    {
      "message": "Role added",
      "role": {
        "role_id": 2,
        "role_name": "Senior Engineer",
        "total_ctc": 150000,
        "base_salary": 100000,
        "bonus": 30000,
        "allowance": 20000
      }
    }
    ```
* **Error Responses:**
    * `403 Forbidden`: "Unauthorized: Not HR"

#### 2. Get All Roles

* **`GET /get-all-roles`**
* **Description:** Retrieves a list of all available job roles.
* **Authentication:** HR Role Required.
* **Success Response (200):**
    ```json
    {
      "roles": [
        {
          "role_id": 1,
          "role_name": "Software Engineer",
          "total_ctc": 100000,
          ...
        },
        {
          "role_id": 2,
          "role_name": "Senior Engineer",
          "total_ctc": 150000,
          ...
        }
      ]
    }
    ```

#### 3. Get Role Info

* **`GET /get-role-info/:role_id`**
* **Description:** Retrieves detailed information for a single role by its ID.
* **Authentication:** HR Role Required.
* **URL Parameters:**
    * `role_id` (integer): The ID of the role to retrieve.
* **Success Response (200):**
    ```json
    {
      "role": {
        "role_id": 1,
        "role_name": "Software Engineer",
        "total_ctc": 100000,
        ...
      }
    }
    ```
* **Error Responses:**
    * `400 Bad Request`: "Invalid role ID"
    * `404 Not Found`: "Role not found"

#### 4. Edit Role

* **`PUT /edit-role/:role_id`**
* **Description:** Updates the details of an existing job role.
* **Authentication:** HR Role Required.
* **URL Parameters:**
    * `role_id` (integer): The ID of the role to edit.
* **Request Body (`editRoleSchema`):**
    ```json
    {
      "role_name": "Principal Engineer",
      "total_ctc": 200000,
      "base_salary": 140000
    }
    ```
* **Side Effects:** Publishes a `role.updated` message to RabbitMQ with the updates and role ID.
* **Success Response (200):**
    ```json
    {
      "message": "Role updated",
      "role": { ... } // Full updated role object
    }
    ```
* **Error Responses:**
    * `400 Bad Request`: "Invalid role ID"
    * `403 Forbidden`: "Unauthorized: Not HR"

### Payroll

#### 1. Initiate Payroll

* **`GET /initiate-payroll`**
* **Description:** Triggers the payroll process. It calculates the number of employees in each role and publishes a `payroll.initiated` message with this data.
* **Authentication:** Required. (Note: This route does *not* have the `validateHR` middleware).
* **Side Effects:** Publishes a `payroll.initiated` message to the `PAYROLL_EXCHANGE` in RabbitMQ.
* **Success Response (200):**
    ```json
    {
      "message": "Payroll initiated",
      "payload": [
        { "role_name": "Software Engineer", "role_emp_count": 10 },
        { "role_name": "Senior Engineer", "role_emp_count": 5 }
      ]
    }
    ```
