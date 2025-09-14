// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import EmployeePage from "./pages/EmployeePage";
import HRPage from "./pages/HRPage"; // Import the HR page

/**
 * This component contains the routing logic.
 * It will be rendered inside AuthProvider, so it has access to the auth context.
 */
const AppRouterLogic = () => {
  const { user, loading } = useAuth();

  // 1. Show a loading screen while the context checks for a user session
  if (loading) {
    return <div>Loading Application...</div>;
  }

  // 2. If we are done loading AND there is no user, define routes for a logged-out user.
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* Any other path a logged-out user tries to access redirects to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // 3. If we are done loading AND we have a user, define routes for an authenticated user.
  return (
    <Routes>
      {/* Role-specific routes */}
      {user.role === "HR" && <Route path="/hr-dashboard" element={<HRPage />} />}
      {user.role === "EMPLOYEE" && (
        <Route path="/employee-dashboard" element={<EmployeePage />} />
      )}

      {/* Redirect the /login path away to the dashboard if the user is already logged in */}
      <Route 
        path="/login" 
        element={<Navigate to={user.role === "HR" ? "/hr-dashboard" : "/employee-dashboard"} replace />} 
      />

      {/* Redirect the root path "/" to the correct dashboard based on role */}
      <Route 
        path="/" 
        element={<Navigate to={user.role === "HR" ? "/hr-dashboard" : "/employee-dashboard"} replace />} 
      />

      {/* A "Not Found" route for any other path typed by an authenticated user */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};

/**
 * Main App component.
 * Sets up the providers (Auth and Browser Router)
 */
const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRouterLogic />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;