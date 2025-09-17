// src/api/payroll.ts
import axios from "axios";

// This new API instance points to your Payroll routes
const api = axios.create({
    baseURL: "http://localhost:3000/api/payroll", // Assumes payroll service is at /api/payroll
    withCredentials: true, // This sends the auth cookie with every request
});

// --- Types (Based on your Prisma Schema) ---

export type PayrollData = {
    id: number;
    total_employees: number;
    gross_amount: number;
    net_amount: number;
    status: string;
    createdAt: string; // Dates will be strings in JSON
};

// --- API Functions ---

/**
 * Fetches all payroll records from the database.
 */
export const getAllPayrolls = async (): Promise<PayrollData[]> => {
    // The backend controller returns { message: "...", payload: all_payrolls }
    const res = await api.get("/get-payroll");
    return res.data.payload;
};