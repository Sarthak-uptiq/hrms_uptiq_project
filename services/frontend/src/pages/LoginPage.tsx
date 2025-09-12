import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../api";
import { useAppContext } from "../context/AppContext";

const LoginPage: React.FC = () => {
  const { setUser } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState<"EMPLOYEE" | "HR">("EMPLOYEE");

  const mutation = useMutation({
    mutationFn: () => loginApi(email, password, role),
    onSuccess: async (loginRes) => {
      // Prefer user from login response
      if (loginRes?.user) {
        setUser({
          userId: loginRes.user.user_id,
          email: loginRes.user.email,
          role: (loginRes.user.role === 'HR' ? 'hr' : 'employee'),
          token: "",
        });
        return;
      }
      // Fallback to verify token if login response doesn't provide user or is malformed
      try {
        const res = await import("../api").then(m => m.verifyTokenApi());
        if (res?.user) {
          setUser({ userId: res.user.id, email: res.user.email, role: (res.user.role === 'HR' ? 'hr' : 'employee'), token: "" });
          return;
        }
      } catch (error) {
        console.error("Error during verifyTokenApi fallback:", error);
      }
      // If all else fails, set minimal user data
      setUser({ userId: "", email, role: (role === 'HR' ? 'hr' : 'employee'), token: "" });
    },
    onError: () => setError("Invalid credentials"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    mutation.mutate();
  };

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md card">
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign in</h2>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <div className="grid gap-1">
            <label className="text-sm text-gray-600">Email</label>
            <input
              className="border rounded px-3 py-2 focus:outline-none focus:ring w-full"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm text-gray-600">Password</label>
            <input
              className="border rounded px-3 py-2 focus:outline-none focus:ring w-full"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm text-gray-600">Role</label>
            <select
              className="border rounded px-3 py-2 focus:outline-none focus:ring w-full"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="HR">HR</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded py-2 font-medium"
          >
            Login
          </button>
        </form>
        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      </div>
    </div>
  );
};

export default LoginPage;
