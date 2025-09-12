import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllEmployees, createEmployee, updateEmployeeStatus, terminateEmployee } from "../api";

const HRPage = () => {
  const queryClient = useQueryClient();
  const { user, logout } = useAppContext();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["allEmployees"],
    queryFn: () => getAllEmployees(),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: (newEmp: any) => createEmployee({
      ...newEmp,
      hr_email: user!.email,
      role_name: newEmp.role_name,
      dep_name: newEmp.dep_name,
      city: newEmp.city,
      state: newEmp.state,
      pincode: newEmp.pincode,
    }),
    onSuccess: () => refetch(),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, statusToUpdate, status_flag, email }: { id: string; statusToUpdate: "EMP_STATUS" | "POLICY"; status_flag: "ACTIVE" | "INACTIVE" | "ACK" | "NOT_ACK"; email: string; }) => updateEmployeeStatus({ id, statusToUpdate, status_flag, email }),
    onSuccess: () => refetch(),
  });

  const deleteMutation = useMutation({
    mutationFn: (email: string) => terminateEmployee({ hr_email: user!.email, email }),
    onSuccess: () => refetch(),
  });

  const [newEmp, setNewEmp] = useState({
    name: "",
    email: "",
    role: "EMPLOYEE",
    city: "",
    state: "",
    pincode: "",
    dep_name: "",
    role_name: "",
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newEmp);
  };

  if (isLoading) return <div className="max-w-6xl mx-auto p-6">Loading...</div>;
  if (!data) return <div className="max-w-6xl mx-auto p-6">No employees found</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid gap-6">
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Add Employee</h2>
        <form onSubmit={handleCreate} className="grid gap-3 md:grid-cols-4">
          <input
            className="border rounded px-3 py-2 focus:outline-none focus:ring w-full"
            placeholder="Name"
            value={newEmp.name}
            onChange={e => setNewEmp({ ...newEmp, name: e.target.value })}
            required
          />
          <input
            className="border rounded px-3 py-2 focus:outline-none focus:ring w-full"
            placeholder="Email"
            value={newEmp.email}
            onChange={e => setNewEmp({ ...newEmp, email: e.target.value })}
            required
          />
          <input
            className="border rounded px-3 py-2 focus:outline-none focus:ring w-full"
            placeholder="City"
            value={newEmp.city}
            onChange={e => setNewEmp({ ...newEmp, city: e.target.value })}
            required
          />
          <input
            className="border rounded px-3 py-2 focus:outline-none focus:ring w-full"
            placeholder="State"
            value={newEmp.state}
            onChange={e => setNewEmp({ ...newEmp, state: e.target.value })}
            required
          />
          <input
            className="border rounded px-3 py-2 focus:outline-none focus:ring w-full"
            placeholder="Pincode"
            value={newEmp.pincode}
            onChange={e => setNewEmp({ ...newEmp, pincode: e.target.value })}
            required
          />
          <input
            className="border rounded px-3 py-2 focus:outline-none focus:ring w-full"
            placeholder="Department Name"
            value={newEmp.dep_name}
            onChange={e => setNewEmp({ ...newEmp, dep_name: e.target.value })}
            required
          />
          <input
            className="border rounded px-3 py-2 focus:outline-none focus:ring w-full"
            placeholder="Role Name"
            value={newEmp.role_name}
            onChange={e => setNewEmp({ ...newEmp, role_name: e.target.value })}
            required
          />
          <select
            className="border rounded px-3 py-2 focus:outline-none focus:ring w-full"
            value={newEmp.role}
            onChange={e => setNewEmp({ ...newEmp, role: e.target.value })}
          >
            <option value="EMPLOYEE">Employee</option>
            <option value="HR">HR</option>
          </select>
          <button type="submit" disabled={createMutation.isLoading} className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2">Add</button>
        </form>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Employees</h2>
          <button onClick={logout} className="text-sm text-red-600">Logout</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((emp: any) => (
                <tr key={emp.id} className="border-t">
                  <td className="py-2 pr-4">{emp.name}</td>
                  <td className="py-2 pr-4">{emp.email}</td>
                  <td className="py-2 pr-4">{emp.role}</td>
                  <td className="py-2 pr-4">
                    <select
                      className="border rounded px-2 py-1"
                      value={emp.status}
                      onChange={e => statusMutation.mutate({ id: emp.id, statusToUpdate: "EMP_STATUS", status_flag: e.target.value as any, email: emp.email })}
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="ACK">Ack</option>
                      <option value="NOT_ACK">Not Ack</option>
                    </select>
                  </td>
                  <td className="py-2 pr-4">
                    <button onClick={() => deleteMutation.mutate(emp.email)} disabled={deleteMutation.isLoading} className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HRPage;
