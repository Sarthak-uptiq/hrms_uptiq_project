import React from "react";
import { useAppContext } from "../context/AppContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getEmployeeDetails, updateEmployeeDetails } from "../api";

const EmployeePage: React.FC = () => {
  const { user, logout } = useAppContext();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["employeeDetails", user?.email],
    queryFn: () => getEmployeeDetails(user!.email),
    enabled: !!user,
  });

  const mutation = useMutation({
    mutationFn: (update: any) => updateEmployeeDetails(update),
    onSuccess: () => refetch(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No data found</div>;

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const update: any = { existingEmail: user!.email };
    formData.forEach((v, k) => (update[k] = v));
    mutation.mutate(update);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 32 }}>
      <h2>Employee Details</h2>
      <form onSubmit={handleUpdate}>
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            <label>{key}</label>
            <input name={key} defaultValue={value as string} />
          </div>
        ))}
        <button type="submit" disabled={mutation.isLoading}>
          Update
        </button>
      </form>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default EmployeePage;
