import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppContextProvider, useAppContext } from "./context/AppContext";
import { verifyTokenApi } from "./api";
import EmployeeDashboard from "./pages/dashboard";
import HRDashboard from "./pages/hr";
import LoginPage from "./pages/LoginPage";
import { hasRole } from "./utils/rbac";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user } = useAppContext();
  if (!user) return <LoginPage />;
  if (hasRole(user, "employee")) return <EmployeeDashboard />;
  if (hasRole(user, "hr")) return <HRDashboard />;
  return <div>Unknown role</div>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <Bootstrap>
          <AppRoutes />
        </Bootstrap>
      </AppContextProvider>
    </QueryClientProvider>
  );
}

export default App;

function Bootstrap({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useAppContext();
  React.useEffect(() => {
    if (!user) {
      verifyTokenApi()
        .then((res) => {
          if (res?.user) {
            const role = (res.user.role === 'HR' ? 'hr' : 'employee') as 'hr' | 'employee';
            setUser({ userId: res.user.id, email: res.user.email, role, token: "" });
          }
        })
        .catch(() => {});
    }
  }, [user, setUser]);
  return <>{children}</>;
}
