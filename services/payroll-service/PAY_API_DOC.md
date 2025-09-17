# Payroll Service API Documentation

This service is responsible for managing and retrieving payroll records. It exposes one HTTP endpoint to get all payrolls and contains internal event listeners to create new payroll records and synchronize role data.

---

## Authentication

All HTTP endpoints are protected by an `authenticateRequest` middleware. This requires a valid authentication token to be sent with any request.

---

## Data Models

[cite_start]The service uses the following data models, defined in `schema.prisma`[cite: 1].

### [cite_start]`Payroll` Model [cite: 1]

Represents a single payroll run.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | Int | Unique ID (auto-increment) for the payroll. |
| `total_employees` | Int | The number of employees included in this payroll. |
| `gross_amount` | Float | The total gross amount paid. |
| `net_amount` | Float | The total net amount paid after deductions. |
| `status` | String | The status of the payroll (e.g., "PENDING"). Defaults to "PENDING". |
| `createdAt` | DateTime | Timestamp of when the record was created. |

### [cite_start]`RolesProjection` Model [cite: 3]

A local projection or cache of role data, likely populated from events.

| Field | Type | Description |
| :--- | :--- | :--- |
| `role_id` | Int | Unique ID for the role. |
| `role_name` | String | Unique name of the role. |
| `total_ctc` | Float | Total Cost to Company for the role. |
| `allowance` | Float | Allowance component. |
| `bonus` | Float | Bonus component. |
| `base_salary` | Float | Base salary component. |

### [cite_start]`TaxSlab` Model [cite: 1]

Defines the tax slabs for calculation.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | Int | Unique ID (auto-increment). |
| `tax_slab_min` | Float | The minimum income for this tax bracket. |
| `tax_slab_max` | Float | The maximum income for this tax bracket. |
| `deduction_percentage`| Float | The tax percentage to be deducted. |

---

## API Endpoints

This service exposes one HTTP endpoint.

### 1. Get All Payrolls

* **`GET /get-payroll`**
* **Description:** Retrieves a list of all historical payroll records.
* **Authentication:** Required.
* **Success Response (200):**
    ```json
    {
      "message": "Returning payrolls",
      "payload": [
        {
          "id": 1,
          "total_employees": 50,
          "gross_amount": 500000,
          "net_amount": 400000,
          "status": "COMPLETED",
          "createdAt": "2023-08-31T00:00:00.000Z"
        },
        {
          "id": 2,
          "total_employees": 52,
          "gross_amount": 510000,
          "net_amount": 408000,
          "status": "PENDING",
          "createdAt": "2023-09-30T00:00:00.000Z"
        }
      ]
    }
    ```
* **Error Responses:**
    * `404 Not Found`: "Request failed" (if no payrolls are found).
    * `401 Unauthorized`: (If authentication fails).

---

## Event-Driven Processes (Internal)

This service also contains handlers that are triggered by internal events (e.g., from a message queue) rather than direct API calls.

### 1. Add Payroll

* **Handler:** `addPayrollController`
* **Trigger:** This function is not an API endpoint. It is triggered internally, likely by consuming a message from an event broker (e.g., `payroll.initiated` from the HR service).
* **Input Schema (`PayrollSchemaType`):**
    ```json
    {
      "total_employees": 65,
      "gross_amount": 650000,
      "net_amount": 520000
    }
    ```
* [cite_start]**Action:** Creates a new `Payroll` record in the database with the provided data and a default status of "PENDING"[cite: 1].

### 2. Role Event Sync

* **Handlers:** `addRole`, `updateRole`, `deleteRole`
* **Trigger:** These functions are triggered by internal events, likely `role.created`, `role.updated`, and `role.deleted` from the HR service.
* [cite_start]**Action:** They maintain the `RolesProjection` table [cite: 3] by creating, updating, or deleting role records to keep the local cache synchronized.