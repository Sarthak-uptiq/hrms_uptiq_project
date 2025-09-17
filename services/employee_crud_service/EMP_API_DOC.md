# Employee Service API Documentation

This service manages employee data, organizational structure (roles, departments), and HR-specific operations. The API is divided into two main parts:

1.  **Employee Details API**: Endpoints for employees to manage their own personal information.
2.  **HR Admin API**: Endpoints for users with an HR role to manage the entire workforce, including adding employees, defining roles, and managing departments.

---

## Authentication

[cite_start]All endpoints in this service are protected and require authentication[cite: 5, 6]. [cite_start]The `authenticateRequest` middleware is applied to all routes, which is expected to verify a token and populate a `req.userEmail` property on the request object[cite: 3, 4, 5, 6]. [cite_start]This email is used to identify the user making the request[cite: 3, 4].

[cite_start]Most HR Admin API endpoints are further protected by a `validateHR` middleware, which ensures that the authenticated user has the permissions of an HR representative[cite: 5].

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
| `state` | String? | [cite_start]Optional: State of residence[cite: 3]. |
| `pincode` | String? | Optional: Pincode of residence. |
| `dep_id` | Int | [cite_start]Foreign key for the `department`[cite: 4]. |
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
| `base_salary` | Float | [cite_start]Base salary component[cite: 6]. |
| `bonus` | Float | Bonus component. |
| `allowance` | Float | Allowance component. |
| `employees` | `employee[]` | Relation to employees with this role. |

---

## Employee Details API

These endpoints are for an authenticated employee to manage their *own* data.

### 1. Get Employee Details

* [cite_start]**`GET /get-all-details`** [cite: 6]
* [cite_start]**Description:** Fetches the complete profile for the authenticated user, including their role and department information[cite: 3].
* **Authentication:** Required. [cite_start]Uses `req.userEmail` to find the user[cite: 3, 6].
* [cite_start]**Success Response (200):** [cite: 3]
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
    * [cite_start]`401 Unauthorized`: "Unauthorized: No token provided" [cite: 3]
    * [cite_start]`404 Not Found`: "No user found" [cite: 3]

### 2. Update Employee Details

* [cite_start]**`PUT /update-emp-details`** [cite: 6]
* [cite_start]**Description:** Updates the personal details (name, city, state, pincode) for the authenticated user[cite: 2, 3].
* **Authentication:** Required. [cite_start]Uses `req.userEmail` to find the user[cite: 3, 6].
* [cite_start]**Middleware:** `validateUpdateRequest` [cite: 6] [cite_start](Validates against `UpdateEmpInputSchema` [cite: 1]).
* [cite_start]**Request Body (`UpdateEmpInputSchema`):** [cite: 1]
    ```json
    {
      "name": "Johnathan Doe",
      "city": "New City",
      "state": "New State",
      "pincode": "54321"
    }
    ```
* [cite_start]**Success Response (200):** [cite: 3]
    ```json
    {
      "message": "User updated",
      "user": { ... } // Full updated employee object
    }
    ```
* **Error Responses:**
    * [cite_start]`401 Unauthorized`: "Unauthorized: No token provided" [cite: 3]

### 3. Update Employee Status or Policy Acknowledgement

* [cite_start]**`PUT /update-emp-status`** [cite: 6]
* [cite_start]**`PUT /ack-policies`** [cite: 6]
* [cite_start]**Description:** Both routes use the same controller (`updateFlags`) to update a specific flag on the employee's profile[cite: 3, 6].
    * `/update-emp-status` is used to change the `status` field.
    * `/ack-policies` is used to change the `policy_ack_status` field.
* **Authentication:** Required. [cite_start]Uses `req.userEmail` to find the user[cite: 3, 6].
* [cite_start]**Middleware:** `validateEmpStatus` [cite: 6] [cite_start](Validates against `UpdateEmpStatus` [cite: 1]).
* [cite_start]**Request Body (`UpdateEmpStatusType`):** [cite: 1, 3]
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
* [cite_start]**Success Response (200):** [cite: 3]
    ```json
    {
      "message": "updated emp status: [POLICY/EMP_STATUS] to [user_object]"
    }
    ```
* **Error Responses:**
    * [cite_start]`401 Unauthorized`: "Unauthorized: No token provided" [cite: 3]
    * [cite_start]`404 Not Found`: "No body found" [cite: 3]

---

## HR Admin API

These endpoints are for users with an HR role to manage employees, departments, and roles.

### Employee Management

#### 1. Add Employee

* [cite_start]**`POST /add-employee`** [cite: 5]
* [cite_start]**Description:** Creates a new employee record in the system[cite: 4].
* [cite_start]**Authentication:** HR Role Required[cite: 4, 5].
* [cite_start]**Request Body (`addEmployeeSchema`):** [cite: 4]
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
* [cite_start]**Side Effects:** Publishes an `employee.created` message to RabbitMQ with the employee's email, role, user ID, and the requesting HR user's ID[cite: 4].
* [cite_start]**Success Response (201):** [cite: 4]
    ```json
    {
      "message": "Employee added",
      "employee": { ... } // New employee object
    }
    ```
* **Error Responses:**
    * [cite_start]`403 Forbidden`: "Unauthorized: Not HR" [cite: 4]
    * [cite_start]`404 Not Found`: "Role or Department not found" or "HR user not found" [cite: 4]

#### 2. Terminate Employee

* [cite_start]**`PUT /terminate-employee`** [cite: 5]
* [cite_start]**Description:** Updates an employee's status to `TERMINATED`[cite: 4].
* [cite_start]**Authentication:** HR Role Required[cite: 4, 5].
* [cite_start]**Request Body (`terminateEmployeeSchema`):** [cite: 4]
    ```json
    {
      "email": "jane.doe@example.com",
      "reason": "Voluntary resignation"
    }
    ```
* [cite_start]**Success Response (200):** [cite: 4]
    ```json
    {
      "message": "Employee terminated",
      "employee": { ... } // Updated employee object
    }
    ```
* **Error Responses:**
    * [cite_start]`403 Forbidden`: "Unauthorized: Not HR" [cite: 4]

#### 3. Get All Employees

* [cite_start]**`GET /get-all-employees`** [cite: 5]
* [cite_start]**Description:** Retrieves a list of all employees, including their full department and role details[cite: 4].
* [cite_start]**Authentication:** HR Role Required[cite: 4, 5].
* [cite_start]**Success Response (200):** [cite: 4]
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

* [cite_start]**`POST /add-department`** [cite: 5]
* [cite_start]**Description:** Creates a new department[cite: 4].
* [cite_start]**Authentication:** HR Role Required[cite: 4, 5].
* [cite_start]**Request Body (`addDepartmentSchema`):** [cite: 4]
    ```json
    {
      "dep_name": "Marketing"
    }
    ```
* [cite_start]**Success Response (201):** [cite: 4]
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
    * [cite_start]`403 Forbidden`: "Unauthorized: Not HR" [cite: 4]

#### 2. Get All Departments

* [cite_start]**`GET /get-all-departments`** [cite: 5]
* [cite_start]**Description:** Retrieves a list of all available departments[cite: 4].
* [cite_start]**Authentication:** HR Role Required[cite: 4, 5].
* [cite_start]**Success Response (200):** [cite: 4]
    ```json
    {
      "departments": [
        { "dep_id": 1, "dep_name": "Engineering" },
        { "dep_id": 2, "dep_name": "Marketing" }
      ]
    }
    ```

#### 3. Edit Department

* [cite_start]**`PUT /edit-department/:dep_id`** [cite: 5]
* [cite_start]**Description:** Updates the name of a specific department[cite: 4].
* [cite_start]**Authentication:** HR Role Required[cite: 4, 5].
* **URL Parameters:**
    * [cite_start]`dep_id` (integer): The ID of the department to edit[cite: 4].
* [cite_start]**Request Body (`editDepartmentSchema`):** [cite: 4]
    ```json
    {
      "dep_name": "Digital Marketing"
    }
    ```
* [cite_start]**Success Response (200):** [cite: 4]
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
    * [cite_start]`400 Bad Request`: "Invalid department ID" [cite: 4]
    * [cite_start]`403 Forbidden`: "Unauthorized: Not HR" [cite: 4]

### Role Management

#### 1. Add Role

* [cite_start]**`POST /add-role`** [cite: 5]
* [cite_start]**Description:** Creates a new job role and its associated compensation structure[cite: 4].
* [cite_start]**Authentication:** HR Role Required[cite: 4, 5].
* [cite_start]**Request Body (`addRoleSchema`):** [cite: 4]
    ```json
    {
      "role_name": "Senior Engineer",
      "total_ctc": 150000,
      "base_salary": 100000,
      "bonus": 30000,
      "allowance": 20000
    }
    ```
* [cite_start]**Side Effects:** Publishes a `role.created` message to RabbitMQ with the new role object[cite: 4].
* [cite_start]**Success Response (201):** [cite: 4]
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
    * [cite_start]`403 Forbidden`: "Unauthorized: Not HR" [cite: 4]

#### 2. Get All Roles

* [cite_start]**`GET /get-all-roles`** [cite: 5]
* [cite_start]**Description:** Retrieves a list of all available job roles[cite: 4].
* [cite_start]**Authentication:** HR Role Required[cite: 4, 5].
* [cite_start]**Success Response (200):** [cite: 4]
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

* [cite_start]**`GET /get-role-info/:role_id`** [cite: 5]
* [cite_start]**Description:** Retrieves detailed information for a single role by its ID[cite: 4].
* [cite_start]**Authentication:** HR Role Required[cite: 4, 5].
* **URL Parameters:**
    * [cite_start]`role_id` (integer): The ID of the role to retrieve[cite: 4].
* [cite_start]**Success Response (200):** [cite: 4]
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
    * [cite_start]`400 Bad Request`: "Invalid role ID" [cite: 4]
    * [cite_start]`404 Not Found`: "Role not found" [cite: 4]

#### 4. Edit Role

* [cite_start]**`PUT /edit-role/:role_id`** [cite: 5]
* [cite_start]**Description:** Updates the details of an existing job role[cite: 4].
* [cite_start]**Authentication:** HR Role Required[cite: 4, 5].
* **URL Parameters:**
    * [cite_start]`role_id` (integer): The ID of the role to edit[cite: 4].
* [cite_start]**Request Body (`editRoleSchema`):** [cite: 4]
    ```json
    {
      "role_name": "Principal Engineer",
      "total_ctc": 200000,
      "base_salary": 140000
    }
    ```
* [cite_start]**Side Effects:** Publishes a `role.updated` message to RabbitMQ with the updates and role ID[cite: 4].
* [cite_start]**Success Response (200):** [cite: 4]
    ```json
    {
      "message": "Role updated",
      "role": { ... } // Full updated role object
    }
    ```
* **Error Responses:**
    * [cite_start]`400 Bad Request`: "Invalid role ID" [cite: 4]
    * [cite_start]`403 Forbidden`: "Unauthorized: Not HR" [cite: 4]

### Payroll

#### 1. Initiate Payroll

* [cite_start]**`GET /initiate-payroll`** [cite: 5]
* **Description:** Triggers the payroll process. [cite_start]It calculates the number of employees in each role and publishes a `payroll.initiated` message with this data[cite: 4].
* [cite_start]**Authentication:** Required[cite: 5]. [cite_start](Note: This route does *not* have the `validateHR` middleware [cite: 5]).
* [cite_start]**Side Effects:** Publishes a `payroll.initiated` message to the `PAYROLL_EXCHANGE` in RabbitMQ[cite: 4].
* [cite_start]**Success Response (200):** [cite: 4]
    ```json
    {
      "message": "Payroll initiated",
      "payload": [
        { "role_name": "Software Engineer", "role_emp_count": 10 },
        { "role_name": "Senior Engineer", "role_emp_count": 5 }
      ]
    }
    ```