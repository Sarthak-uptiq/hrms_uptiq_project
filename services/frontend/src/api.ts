import axios from "axios";

const GATEWAY_URL = "http://localhost:3000"; // Gateway-service port

// Ensure axios sends cookies
const api = axios.create({
  baseURL: GATEWAY_URL,
  withCredentials: true,
});

// Auth APIs (backend sets httpOnly cookie)
export async function loginApi(email: string, password: string, role: "EMPLOYEE" | "HR") {
  const res = await api.post(`/api/auth/login`, { email, password, role });
  console.log("loginApi response:", res.data);
  return res.data;
}

export async function verifyTokenApi() {
  const res = await api.get(`/api/auth/verify-token`);
  console.log("verifyTokenApi response:", res.data);
  return res.data;
}

// Employee APIs
export async function getEmployeeDetails(email: string) {
  // Send email as query param for GET
  const res = await api.get(`/api/emp/details/get-all-details`, { params: { email } });
  console.log("getEmployeeDetails response:", res.data);
  return res.data;
}

export async function updateEmployeeDetails(update: any & { existingEmail: string }) {
  const res = await api.put(`/api/emp/details/update-emp-details`, update);
  console.log("updateEmployeeDetails response:", res.data);
  return res.data;
}

// HR APIs
export async function getAllEmployees() {
  const res = await api.get(`/api/hr/get-all-employees`);
  console.log("getAllEmployees response:", res.data);
  return res.data;
}

export async function createEmployee(data: any) {
  const res = await api.post(`/api/hr/add-employee`, data);
  console.log("createEmployee response:", res.data);
  return res.data;
}

export async function updateEmployeeStatus(payload: { id: string; statusToUpdate: "EMP_STATUS" | "POLICY"; status_flag: "ACTIVE" | "INACTIVE" | "ACK" | "NOT_ACK"; email: string; }) {
  const res = await api.put(`/api/emp/details/update-emp-status`, payload);
  console.log("updateEmployeeStatus response:", res.data);
  return res.data;
}

export async function terminateEmployee(payload: { id: string }) {
  const res = await api.put(`/api/hr/terminate-employee`, payload);
  console.log("terminateEmployee response:", res.data);
  return res.data;
}
