import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getEmployeeDetails, updateEmployeeDetails } from '../api';
import { AttendanceSummary } from '../features/attendance/AttendanceSummary';
import { LeaveBalance } from '../features/attendance/LeaveBalance';
import { PayrollView } from '../features/payroll/PayrollView';
import { Navbar } from '../components/Navbar';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

const EmployeeDashboard: React.FC = () => {
  const { user } = useAppContext();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['employeeDetails', user?.email],
    queryFn: () => getEmployeeDetails(user!.email),
    enabled: !!user,
  });

  const mutation = useMutation({
    mutationFn: (update: any) => updateEmployeeDetails({ ...update, existingEmail: user!.email }),
    onSuccess: () => refetch(),
  });

  const [editMode, setEditMode] = React.useState(false);
  const [form, setForm] = React.useState<any>({});

  React.useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  if (isLoading) return <div className="max-w-4xl mx-auto p-6">Loading...</div>;
  if (!data) return <div className="max-w-4xl mx-auto p-6">No profile found</div>;

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
    setEditMode(false);
  };

  return (
    <div>
      <Navbar user={user ? { name: user.email, role: user.role } : undefined} />
      <main className="max-w-6xl mx-auto p-6 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 grid gap-6">
          <div className="card">
            <h3 className="font-bold mb-2">Attendance</h3>
            <AttendanceSummary />
          </div>
          <div className="card">
            <h3 className="font-bold mb-2">Leave Balance</h3>
            <LeaveBalance />
          </div>
          <div className="card">
            <h3 className="font-bold mb-2">Payroll</h3>
            <PayrollView />
          </div>
        </div>
        <div className="card md:col-span-1 h-fit">
          <h3 className="font-bold mb-2">My Profile</h3>
          {editMode ? (
            <form onSubmit={handleEdit} className="grid gap-3">
              <Input label="Name" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
              <Input label="Email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} />
              <Input label="Job Title" value={form.jobTitle || ''} onChange={e => setForm({ ...form, jobTitle: e.target.value })} />
              <Input label="Department" value={form.department || ''} onChange={e => setForm({ ...form, department: e.target.value })} />
              <div className="flex gap-2">
                <Button type="submit" variant="primary">Save</Button>
                <Button type="button" variant="secondary" onClick={() => setEditMode(false)}>Cancel</Button>
              </div>
            </form>
          ) : (
            <div className="grid gap-2 text-sm">
              <div><b>Name:</b> {data.name}</div>
              <div><b>Email:</b> {data.email}</div>
              <div><b>Job Title:</b> {data.jobTitle}</div>
              <div><b>Department:</b> {data.department}</div>
              <Button className="mt-2" onClick={() => setEditMode(true)}>Edit Profile</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
