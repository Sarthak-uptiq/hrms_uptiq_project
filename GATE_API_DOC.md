# API Gateway Documentation

This service is the central API Gateway for the application. It acts as the single entry point for all frontend requests and routes them to the appropriate backend microservice.

---

## General Configuration

* [cite_start]**Host Port**: The gateway service runs on `http://localhost:3000`. [cite: 1]
* [cite_start]**CORS Policy**: The gateway is configured to only allow requests from the frontend application. [cite: 1]
    * [cite_start]**Allowed Origin**: `http://localhost:5173` [cite: 1]
    * [cite_start]**Credentials**: `true` (Allows cookies to be forwarded) [cite: 1]

---

## Health Check

A simple endpoint is available to confirm that the gateway service is operational.

* **`GET /`**
    * [cite_start]**Description**: Checks the status of the gateway service. [cite: 1]
    * **Success Response (200)**:
        * **Content-Type**: `text/html`
        * [cite_start]**Body**: `Gateway Service Running` [cite: 1]

---

## Service Routing Rules

The gateway proxies requests to various downstream microservices based on the request path. [cite_start]All proxies are configured with `changeOrigin: true`. [cite: 1]

| Gateway Path (Incoming) | Downstream Service | Target URL (Proxied To) |
| :--- | :--- | :--- |
| `/api/auth/*` | Auth Service | [cite_start]`http://localhost:5000` [cite: 1] |
| `/api/emp/details/*` | Employee CRUD Service | [cite_start]`http://localhost:5001` [cite: 1] |
| `/api/emp/docs/*` | Employee CRUD Service | [cite_start]`http://localhost:5001` [cite: 1] |
| `/api/hr/*` | Employee CRUD Service | [cite_start]`http://localhost:5001` [cite: 1] |
| `/api/payroll/*` | Payroll Service | [cite_start]`http://localhost:5005` [cite: 1] |

**Note on Path Rewriting:** The gateway passes the full path prefix to the downstream service. [cite_start]For example, a request to `/api/auth/login` is proxied to `http://localhost:5000/api/auth/login`. [cite: 1]