// src/api/employee.ts
import axios from "axios";

// This creates a new 'api' instance for your employee routes.
// It assumes your empDetailRouter is mounted at '/api/employee' in your main server file.
const api = axios.create({
  baseURL: "http://localhost:3000/api/emp/details", // Assuming this is the base path
  withCredentials: true, // Required to send the auth cookie
});

// --- Types ---
// These types are based on your 'getEmpDetails' repository function
export type UpdateEmployeePayload = {
  name?: string;
  city?: string;
  state?: string;
  pincode?: string;
};

export type EmployeeDetails = {
  name: string;
  email: string;
  city: string;
  state: string;
  pincode: string;
  status: string;
  policy_ack_status: string;
  department: {
    dep_name: string;
  };
  role: {
    role_name: string;
    total_ctc: number; // Assuming number based on context
    base_salary: number;
    bonus: number;
    allowance: number;
  };
};


// --- API Functions ---

/**
 * Fetches all details for the currently logged-in employee.
 * Backend Route: GET /get-all-details
 */
export const getEmployeeDetails = async (): Promise<EmployeeDetails> => {
  const res = await api.get("/get-all-details");
  return res.data.user; // This returns the nested user object directly
};

/**
 * Updates the employee's mutable personal details.
 * Backend Route: PUT /update-emp-details
 * Schema: UpdateEmpInputSchema
 */
export const updateEmployeeDetails = async (payload: UpdateEmployeePayload) => {
  const res = await api.put("/update-emp-details", payload);
  return res.data;
};

/**
 * Acknowledges the company policy.
 * Backend Route: PUT /ack-policies
 * This sends the specific body required by your UpdateEmpStatus schema
 */
export const updatePolicyAck = async () => {
  const payload = {
    statusToUpdate: "POLICY",
    status_flag: "ACKNOWLEDGED",
  };
  const res = await api.put("/ack-policies", payload);
  return res.data;
};

/**
 * Resigns from the company.
 * Backend Route: PUT /update-emp-status
 * This sends the specific body required by your UpdateEmpStatus schema
 */
export const resignFromCompany = async () => {
  const payload = {
    statusToUpdate: "EMP_STATUS",
    status_flag: "INACTIVE",
  };
  const res = await api.put("/update-emp-status", payload);
  return res.data;
};


// --- Placeholder Functions ---
// You have no backend routes defined for Payroll or AI Chat.
// These functions are added so your UI doesn't crash, but they will fail.

export const getPayrollData = async () => {
  // TODO: You have no backend route for this in your provided files.
  console.error("No payroll API route provided.");
  throw new Error("Payroll service is not available.");
};

export const initiateAIChat = async () => {
  // TODO: You have no backend route for this.
  console.log("AI Chat feature not implemented in backend.");
  // This is a fire-and-forget, so we don't throw an error.
};