# Employee Management System (Microservices)

This project is a back-end application for a comprehensive Employee Management System. It is built using a microservice architecture, where different business functionalities are decoupled into independent services. All services are routed through a central API Gateway, which acts as the single entry point for a client application.

## System Architecture

The system is composed of four main microservices:
1.  **API Gateway**: The single entry point for all client requests.
2.  **Auth Service**: Handles user authentication, token management, and event-driven registration.
3.  **Employee Service**: The core service for all HR and employee-facing data management.
4.  **Payroll Service**: Manages payroll records and listens for events to trigger new payroll runs.

These services communicate with each other asynchronously using a message broker (e.g., RabbitMQ) for events like user registration, role creation, and payroll initiation.



[Image of a microservice architecture diagram]


---

## Service Breakdown

### 1. API Gateway

* [cite_start]**Port**: `3000` [cite: 1]
* **Description**: This service is the front door to the application. [cite_start]It uses `http-proxy-middleware` to route incoming requests to the correct downstream service[cite: 1]. [cite_start]It also handles CORS for the client application[cite: 1].
* [cite_start]**Routing Rules**[cite: 1]:
    * `http://localhost:3000/api/auth/*` &rarr; **Auth Service** (`:5000`)
    * `http://localhost:3000/api/emp/*` &rarr; **Employee Service** (`:5001`)
    * `http://localhost:3000/api/hr/*` &rarr; **Employee Service** (`:5001`)
    * `http://localhost:3000/api/payroll/*` &rarr; **Payroll Service** (`:5005`)

### 2. Auth Service

* [cite_start]**Port**: `5000` (inferred from Gateway) [cite: 1]
* **Description**: Manages user identity and authentication.
* **API Endpoints**:
    * `POST /login`: Authenticates a user and sets a secure `httpOnly` cookie.
    * `GET /verify-token`: Verifies the validity of the user's auth token cookie.
    * `POST /logout`: Clears the auth token cookie.
* **Event-Driven Processes**:
    * **User Registration**: This service does not have a public `/register` endpoint. Instead, it listens for an event (e.g., `employee.created` from the Employee Service) to create a new user, generate a random password, and publish a message with the new credentials.

### 3. Employee Service

* [cite_start]**Port**: `5001` (inferred from Gateway) [cite: 1]
* **Description**: This is the core service for managing all employee data, organizational structure (roles, departments), and HR-specific workflows.
* **HR Admin API (`/api/hr`)**:
    * **Employee Management**: `POST /add-employee`, `PUT /terminate-employee`, `GET /get-all-employees`.
    * **Department Management**: `POST /add-department`, `PUT /edit-department/:dep_id`, `GET /get-all-departments`.
    * **Role Management**: `POST /add-role`, `PUT /edit-role/:role_id`, `GET /get-all-roles`, `GET /get-role-info/:role_id`.
    * **Payroll**: `GET /initiate-payroll` (Publishes an event to trigger the Payroll Service).
* **Employee Details API (`/api/emp/details`)**:
    * `GET /get-all-details`: Fetches the logged-in user's own profile.
    * `PUT /update-emp-details`: Allows a user to update their personal information.
    * `PUT /ack-policies`: Allows a user to acknowledge company policies.

### 4. Payroll Service

* [cite_start]**Port**: `5005` (inferred from Gateway) [cite: 1]
* **Description**: Manages historical payroll records and maintains its own projection of role data.
* **API Endpoints**:
    * `GET /get-payroll`: Retrieves a list of all past payroll runs.
* **Event-Driven Processes**:
    * **Payroll Creation**: Listens for the `payroll.initiated` event from the Employee Service. When received, it calculates and creates a new `Payroll` record in its database.
    * **Role Sync**: Listens for `role.created` and `role.updated` events to keep its local `RolesProjection` table synchronized with the Employee Service.

---

## Tech Stack

* [cite_start]**Backend**: Node.js, Express.js [cite: 1]
* **Language**: TypeScript
* **Database**: PostgreSQL
* **ORM**: Prisma
* [cite_start]**Validation**: Zod [cite: 2, 3]
* **Authentication**: JWT (jsonwebtoken), bcrypt
* [cite_start]**Gateway**: `http-proxy-middleware` [cite: 1]
* **Messaging**: RabbitMQ (inferred from `publishMessage` and `EXCHANGE_NAME`)
* [cite_start]**Utilities**: `cors` [cite: 1]

---

## API Documentation

For detailed information on each service's endpoints, request bodies, and responses, please see the individual documentation files:

* [API Gateway Documentation](api-gateway.md)
* [Auth Service Documentation](auth-service.md)
* [Employee Service Documentation](employee-service.md)
* [Payroll Service Documentation](payroll-service.md)

---

## How to Run

### Prerequisites

* Node.js (v18+)
* npm
* Docker (for PostgreSQL & RabbitMQ)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [your-repo-url]
    cd [project-folder]
    ```

2.  **Install dependencies for each service:**
    You will need to run `npm install` in each service's directory:
    * `api-gateway/`
    * `auth-service/`
    * `employee-service/`
    * `payroll-service/`

3.  **Set up Environment Variables:**
    Each service (except the gateway) requires a `.env` file with a `DATABASE_URL` for Prisma.
    ```
    # Example for auth-service/.env
    DATABASE_URL="postgresql://user:password@localhost:5432/auth_db?schema=public"
    TOKEN_EXPIRY="1h"
    ```

4.  **Run Database Migrations:**
    For each service with a `schema.prisma` file, run the migrate command:
    ```bash
    cd auth-service
    npx prisma migrate dev
    
    cd ../employee-service
    npx prisma migrate dev
    
    cd ../payroll-service
    npx prisma migrate dev
    ```

5.  **Start all services:**
    Open a terminal for each service and run `npm start`.

    * `cd api-gateway && npm start` (Runs on port 3000)
    * `cd auth-service && npm start` (Runs on port 5000)
    * `cd employee-service && npm start` (Runs on port 5001)
    * `cd payroll-service && npm start` (Runs on port 5005)

The application gateway is now accessible at `http://localhost:3000`.