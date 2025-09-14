// src/pages/LoginPage.tsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { loginUser } = useAuth();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"HR" | "EMPLOYEE">("EMPLOYEE");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(email, password, role);
      
      // Navigate *after* login succeeds
      if (role === "HR") {
        navigate("/hr-dashboard");
      } else {
        navigate("/employee-dashboard");
      }
    } catch (err: any) {
      setError("Invalid credentials. Please check and try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">HRMS Portal</h1>
          <p className="text-gray-500 text-sm mt-2">
            Please log in with your credentials
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 p-3 rounded-lg transition outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value as "HR" | "EMPLOYEE")}
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="HR">HR</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 p-3 rounded-lg transition outline-none"
              placeholder="you@company.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 p-3 rounded-lg transition outline-none"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-md transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;