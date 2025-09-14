// src/api/auth.ts
import axios from "axios";

// Configure a base instance to always include credentials (cookies)
const api = axios.create({
  baseURL: "http://localhost:3000/api/auth", // Ensure this matches your backend port
  withCredentials: true, // This is essential for sending/receiving cookies
});

export const login = async (email: string, password: string, role: string) => {
  const res = await api.post(`/login`, { email, password, role });
  return res.data; // Returns { message, user }
};

export const verifyToken = async () => {
  // Backend verifies the cookie sent automatically by the browser
  const res = await api.get(`/verify-token`);
  return res.data; // Returns { user }
};

export const logout = async () => {
  // Call the backend endpoint to clear the HTTPOnly cookie
  const res = await api.post(`/logout`);
  return res.data;
};