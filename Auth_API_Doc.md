Here is the raw Markdown content for the API documentation. You can copy this and save it as a `.md` file.

````markdown
# Auth Service API Documentation

This service handles user authentication, including login, logout, and token verification. [cite_start]User registration is handled as an internal, event-driven process rather than a direct API endpoint[cite: 2].

Authentication is managed using a JWT (JSON Web Token) set in a secure, `httpOnly` cookie named `auth_token`. This token is signed using the `RS26` algorithm and has a 1-hour expiry.

## Data Models

### `AuthRole` (Enum)

[cite_start]Defines the possible roles a user can have[cite: 1]:
* [cite_start]`ADMIN` [cite: 1]
* [cite_start]`HR` [cite: 1]
* [cite_start]`EMPLOYEE` [cite: 1]

### `User` (Database Model)

[cite_start]Represents a user in the database[cite: 1].

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | Int | [cite_start]Auto-incrementing primary key[cite: 1]. |
| `user_id` | String | [cite_start]Unique user identifier[cite: 1]. |
| `email` | String | [cite_start]Unique user email[cite: 1]. |
| `password` | String | [cite_start]User's password (hashed during registration)[cite: 1]. |
| `authrole` | `AuthRole` | [cite_start]User's role (e.g., `HR`, `EMPLOYEE`)[cite: 1]. |
| `createdAt` | DateTime | [cite_start]Timestamp of user creation[cite: 1]. |

---

## API Endpoints

### 1. User Login

* [cite_start]**`POST /login`** [cite: 2]

Authenticates a user based on email and password. On success, it sets a signed `auth_token` cookie.

**Request Body (`application/json`)**

Based on `UserSchema`:

```json
{
  "email": "user@example.com",
  "password": "user_password",
  "role": "EMPLOYEE"
}
````

**Implementation Notes:**

  * The `password` provided in the request body is compared using a **direct string comparison** (`===`) against the password stored in the database.
  * If the user's stored role is `EMPLOYEE`, the `role` in the request body *must* also be `EMPLOYEE`.

**Success Response (201)**

  * **Cookie Set:** `auth_token`

  * **Body:**

    ```json
    {
      "message": "User logged in successfully",
      "user": {
        "email": "user@example.com",
        "role": "EMPLOYEE",
        "user_id": "some_user_id"
      }
    }
    ```

**Error Responses**

  * **`404 Not Found`**:
    ```json
    {
      "success": false,
      "message": "User does not exists"
    }
    ```
  * **`401 Unauthorized`**:
    ```json
    {
      "message": "Password Incorrect!!"
    }
    ```
  * **`409 Conflict`**: (e.g., if an `EMPLOYEE` attempts to log in with `role: "HR"`)
    ```json
    {
      "message": "Invalid role"
    }
    ```

### 2\. Verify Authentication Token

  * [cite\_start]**`GET /verify-token`** [cite: 2]

Verifies the `auth_token` cookie sent with the request. This is used to confirm if a user is still authenticated.

**Request**

  * The client must send the `auth_token` cookie that was set during login.

**Success Response (200)**

Returns the decoded user payload from the JWT.

```json
{
  "user": {
    "email": "user@example.com",
    "id": "some_user_id",
    "role": "EMPLOYEE"
  }
}
```

**Error Responses**

  * **`401 Unauthorized`**: (If the `auth_token` cookie is missing)
    ```json
    {
      "message": "auth token not found"
    }
    ```
  * **`500 Internal Server Error`**: (If the token is invalid, malformed, or expired)

### 3\. User Logout

  * [cite\_start]**`POST /logout`** [cite: 2]

Logs the user out by clearing the `auth_token` cookie.

**Request Body**

  * None required.

**Success Response (200)**

  * **Cookie Cleared:** `auth_token`

  * **Body:**

    ```json
    {
      "message": "Logged out successfully"
    }
    ```

-----

## Event-Driven Processes

### User Registration

[cite\_start]User registration is **not** an HTTP endpoint[cite: 2]. It is handled by an internal `register` function that is likely triggered by a message queue or another internal service.

**Trigger Input (`RegisterSchemaType`)**

The function expects an event message with the following structure:

```json
{
  "email": "newuser@example.com",
  "role": "EMPLOYEE",
  "user_id": "new_user_id_string",
  "requested_by": "hr_user_id_string"
}
```

**Process Logic**

1.  Checks if the `email` already exists.
2.  Finds the user specified by `requested_by`.
3.  Verifies that the `requested_by` user has the `authrole` of **"HR"**.
4.  Generates a random 10-character password.
5.  Creates the new user in the database, storing a **`bcrypt`-hashed** version of the random password.
6.  Publishes a `user.created` message (e.g., to a message broker) with the new user's email and the *plaintext* random password, intended to be sent to the user.

**Process Outcomes (Internal Messages)**

  * `"User already exists"`
  * `"Requesting user not found"`
  * `"Only HR can register a user"`
  * `"User created successfully"`
  * `"Error in registering user"`

<!-- end list -->

```
```