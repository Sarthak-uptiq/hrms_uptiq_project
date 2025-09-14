// src/pages/HRPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import EmployeePage from './EmployeePage'; // Re-used for the 'My Profile' tab

// Import all our new HR API functions and types
import * as hrApi from '../api/hr';
import type { 
  EmployeeData, 
  RoleData, 
  DepartmentData, 
  NewEmployeePayload,
  AddRolePayload,
  EditRolePayload
} from '../api/hr';

//=================================================================
// 1. MY PROFILE TAB
// We just re-use the component we already built.
//=================================================================
const MyProfileTab: React.FC = () => {
  return (
    <div>
      <h2 style={styles.tabTitle}>My Profile</h2>
      <EmployeePage />
    </div>
  );
};

//=================================================================
// 2. EMPLOYEE MANAGEMENT TAB (Master-Detail Implementation)
//=================================================================
const EmployeeManagementTab: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const emps = await hrApi.getAllEmployees(); // Fetches the array from { "employees": [...] }
      setEmployees(emps);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectEmployee = (emp: EmployeeData) => {
    setSelectedEmployee(emp);
    setShowAddForm(false);
  };

  const handleShowAddForm = () => {
    setSelectedEmployee(null);
    setShowAddForm(true);
  };

  // Called from the Add/Terminate components to refresh the list
  const handleActionComplete = () => {
    setShowAddForm(false);
    setSelectedEmployee(null);
    fetchData(); // Refetch the main employee list
  };

  if (loading) return <div>Loading employees...</div>;

  return (
    <div>
      <h2 style={styles.tabTitle}>Employee Management</h2>
      <div style={styles.masterDetailLayout}>
        {/* Master List */}
        <div style={styles.masterList}>
          <button onClick={handleShowAddForm} style={styles.addButton}>+ Add New Employee</button>
          {employees.map(emp => (
            <div 
              key={emp.emp_id} 
              onClick={() => handleSelectEmployee(emp)}
              style={styles.listItem(selectedEmployee?.emp_id === emp.emp_id)}
            >
              <strong>{emp.name}</strong><br/>
              <small>{emp.role.role_name}</small>
            </div>
          ))}
        </div>
        {/* Detail Panel */}
        <div style={styles.detailPanel}>
          {showAddForm && (
            <AddEmployeeForm onComplete={handleActionComplete} />
          )}
          {selectedEmployee && !showAddForm && (
            <EmployeeDetail employee={selectedEmployee} onComplete={handleActionComplete} />
          )}
          {!selectedEmployee && !showAddForm && (
            <p>Select an employee to view details or add a new one.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Employee Sub-Component: Detail View ---
const EmployeeDetail: React.FC<{ employee: EmployeeData, onComplete: () => void }> = ({ employee, onComplete }) => {
  
  const handleTerminate = async () => {
    if (window.confirm(`Are you sure you want to terminate ${employee.name}? This cannot be undone.`)) {
      try {
        await hrApi.terminateEmployee(employee.email);
        alert("Employee terminated.");
        onComplete(); // Refresh parent list
      } catch (err) {
        alert("Failed to terminate employee.");
      }
    }
  };

  return (
    <div>
      <h3>{employee.name}</h3>
      <p><strong>Email:</strong> {employee.email}</p>
      <p><strong>Status:</strong> {employee.status}</p>
      <p><strong>Department:</strong> {employee.department.dep_name}</p>
      <p><strong>Role:</strong> {employee.role.role_name}</p>
      <p><strong>Policy:</strong> {employee.policy_ack_status}</p>
      <p><strong>Location:</strong> {`${employee.city}, ${employee.state}`}</p>
      
      {employee.status === 'ACTIVE' && (
        <button onClick={handleTerminate} className="resign-btn">Terminate Employee</button>
      )}
    </div>
  );
};

// --- Employee Sub-Component: Add Employee Form ---
const AddEmployeeForm: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [formData, setFormData] = useState<Omit<NewEmployeePayload, 'role_id' | 'dep_id'>>({
    name: '', email: '', city: '', state: '', pincode: ''
  });
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [selectedDepId, setSelectedDepId] = useState<string>("");
  
  const [allRoles, setAllRoles] = useState<RoleData[]>([]);
  const [allDepartments, setAllDepartments] = useState<DepartmentData[]>([]);

  // On mount, fetch the roles and departments needed for the dropdowns
  useEffect(() => {
    hrApi.getAllRoles().then(setAllRoles);
    hrApi.getAllDepartments().then(setAllDepartments);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleId || !selectedDepId) {
      alert("Please select a role and department.");
      return;
    }
    
    const payload: NewEmployeePayload = {
      ...formData,
      role_id: parseInt(selectedRoleId), // Convert string from <select> back to number
      dep_id: parseInt(selectedDepId)   // Convert string back to number
    };

    try {
      await hrApi.addEmployee(payload);
      alert("Employee added successfully!");
      onComplete(); // Refresh parent list
    } catch (err) {
      alert("Failed to add employee.");
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit} style={styles.formLayout}>
      <h3>Add New Employee</h3>
      <input name="name" placeholder="Full Name" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email Address" onChange={handleChange} required />
      <input name="city" placeholder="City" onChange={handleChange} required />
      <input name="state" placeholder="State" onChange={handleChange} required />
      <input name="pincode" placeholder="Pincode" onChange={handleChange} required />
      <select value={selectedRoleId} onChange={e => setSelectedRoleId(e.target.value)} required>
        <option value="" disabled>-- Select a Role --</option>
        {allRoles.map(role => (
          <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
        ))}
      </select>
      <select value={selectedDepId} onChange={e => setSelectedDepId(e.target.value)} required>
        <option value="" disabled>-- Select a Department --</option>
        {allDepartments.map(dep => (
          <option key={dep.dep_id} value={dep.dep_id}>{dep.dep_name}</option>
        ))}
      </select>
      <button type="submit">Create Employee</button>
    </form>
  );
};


//=================================================================
// 3. ROLE MANAGEMENT TAB
// Uses the same Master-Detail pattern, but the "Detail" pane is the Edit Form.
//=================================================================
const RoleManagementTab: React.FC = () => {
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const fetchData = async () => {
    hrApi.getAllRoles().then(setRoles).catch(err => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleActionComplete = () => {
    setSelectedRole(null);
    setIsAddingNew(false);
    fetchData(); // Refetch all roles
  };

  return (
    <div>
      <h2 style={styles.tabTitle}>Role Management</h2>
      <div style={styles.masterDetailLayout}>
        {/* Master List */}
        <div style={styles.masterList}>
          <button 
            onClick={() => { setIsAddingNew(true); setSelectedRole(null); }} 
            style={styles.addButton}
          >
            + Add New Role
          </button>
          {roles.map(role => (
            <div 
              key={role.role_id} 
              onClick={() => { setSelectedRole(role); setIsAddingNew(false); }}
              style={styles.listItem(selectedRole?.role_id === role.role_id)}
            >
              <strong>{role.role_name}</strong>
            </div>
          ))}
        </div>
        {/* Detail Panel (is the Form) */}
        <div style={styles.detailPanel}>
          {(selectedRole || isAddingNew) ? (
            <RoleEditForm 
              key={selectedRole?.role_id ?? 'new'} // Re-mounts component on selection change
              role={selectedRole} 
              onComplete={handleActionComplete} 
            />
          ) : (
            <p>Select a role to edit or add a new one.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Role Sub-Component: Add/Edit Form ---
const RoleEditForm: React.FC<{ role: RoleData | null, onComplete: () => void }> = ({ role, onComplete }) => {
  // If a role is passed, we are editing. If role is null, we are adding.
  const isEditMode = role !== null;
  const [formData, setFormData] = useState<AddRolePayload | EditRolePayload>({
    role_name: role?.role_name || '',
    total_ctc: role?.total_ctc || 0,
    base_salary: role?.base_salary || 0,
    bonus: role?.bonus || 0,
    allowance: role?.allowance || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Convert numbers from string input
    const newValue = ['total_ctc', 'base_salary', 'bonus', 'allowance'].includes(name)
      ? parseInt(value)
      : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && role) {
        // Edit Mode
        await hrApi.editRole(role.role_id, formData);
        alert("Role updated successfully.");
      } else {
        // Add Mode (ensure all fields are present)
        await hrApi.addRole(formData as AddRolePayload);
        alert("Role added successfully.");
      }
      onComplete();
    } catch (err) {
      alert("Action failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.formLayout}>
      <h3>{isEditMode ? `Edit ${role.role_name}` : 'Add New Role'}</h3>
      <input name="role_name" value={formData.role_name} placeholder="Role Name" onChange={handleChange} required />
      <input name="total_ctc" type="number" value={formData.total_ctc} placeholder="Total CTC" onChange={handleChange} required />
      <input name="base_salary" type="number" value={formData.base_salary} placeholder="Base Salary" onChange={handleChange} required />
      <input name="bonus" type="number" value={formData.bonus} placeholder="Bonus" onChange={handleChange} required />
      <input name="allowance" type="number" value={formData.allowance} placeholder="Allowance" onChange={handleChange} required />
      <button type="submit">{isEditMode ? 'Update Role' : 'Create Role'}</button>
    </form>
  );
};


//=================================================================
// 4. DEPARTMENT MANAGEMENT TAB
// This is the full implementation, replacing your placeholder.
//=================================================================
const DepartmentManagementTab: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentData | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const deps = await hrApi.getAllDepartments();
      setDepartments(deps);
    } catch (err) {
      console.error("Failed to fetch departments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // This is passed to the form to refetch the list after a change
  const handleActionComplete = () => {
    setSelectedDepartment(null);
    setIsAddingNew(false);
    fetchData();
  };

  if (loading) return <div>Loading departments...</div>;

  return (
    <div>
      <h2 style={styles.tabTitle}>Department Management</h2>
      <div style={styles.masterDetailLayout}>
        {/* Master List */}
        <div style={styles.masterList}>
          <button
            onClick={() => { setIsAddingNew(true); setSelectedDepartment(null); }}
            style={styles.addButton}
          >
            + Add New Department
          </button>
          {departments.map(dep => (
            <div
              key={dep.dep_id}
              onClick={() => { setSelectedDepartment(dep); setIsAddingNew(false); }}
              style={styles.listItem(selectedDepartment?.dep_id === dep.dep_id)}
            >
              <strong>{dep.dep_name}</strong>
            </div>
          ))}
        </div>
        
        {/* Detail Panel (renders the form) */}
        <div style={styles.detailPanel}>
          {(selectedDepartment || isAddingNew) ? (
            <DepartmentEditForm
              key={selectedDepartment?.dep_id ?? 'new'} // Re-mounts form on selection change
              department={selectedDepartment}
              onComplete={handleActionComplete}
            />
          ) : (
            <p>Select a department to edit or add a new one.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Department Sub-Component: Add/Edit Form ---
const DepartmentEditForm: React.FC<{ department: DepartmentData | null, onComplete: () => void }> = ({ department, onComplete }) => {
  const isEditMode = department !== null;
  const [depName, setDepName] = useState("");

  // This effect populates the form when a department is selected,
  // or clears it when 'Add New' is clicked.
  useEffect(() => {
    if (department) {
      setDepName(department.dep_name);
    } else {
      setDepName(""); // Clear field for 'Add New' mode
    }
  }, [department]); // Re-run this logic every time the department prop changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depName) {
      alert("Department name cannot be empty.");
      return;
    }

    try {
      if (isEditMode && department) {
        // Edit Mode
        await hrApi.editDepartment(department.dep_id, depName);
        alert("Department updated successfully.");
      } else {
        // Add Mode
        await hrApi.addDepartment(depName);
        alert("Department added successfully.");
      }
      onComplete(); // Tell the parent to refetch the list
    } catch (err) {
      alert("Action failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.formLayout}>
      <h3>{isEditMode ? `Edit ${department.dep_name}` : 'Add New Department'}</h3>
      <label>
        Department Name:
        <input
          name="dep_name"
          value={depName}
          placeholder="e.g., Engineering"
          onChange={(e) => setDepName(e.target.value)}
          required
          style={{ marginTop: '8px' }}
        />
      </label>
      <button type="submit" style={{ marginTop: '1rem' }}>
        {isEditMode ? 'Update Department' : 'Create Department'}
      </button>
    </form>
  );
};


//=================================================================
// 5. PAYROLL TAB
//=================================================================
const PayrollTab: React.FC = () => {
  const handleInitiatePayroll = () => {
    alert("TODO: This feature is not connected. No backend API route exists for payroll.");
  };

  return (
    <div>
      <h2 style={styles.tabTitle}>Payroll</h2>
      <p>HR's own payroll data would appear here (if different from My Profile).</p>
      <button onClick={handleInitiatePayroll}>Initiate Company Payroll</button>
    </div>
  );
};



//=================================================================
// MAIN HR PAGE COMPONENT (Shell and Navigation)
//=================================================================
type TabName = 'profile' | 'employees' | 'roles' | 'departments' | 'payroll';

const HRPage: React.FC = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabName>('profile');

  // Helper function to render the correct tab component
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <MyProfileTab />;
      case 'employees':
        return <EmployeeManagementTab />;
      case 'roles':
        return <RoleManagementTab />;
      case 'departments':
        return <DepartmentManagementTab />;
      case 'payroll':
        return <PayrollTab />;
      default:
        return <MyProfileTab />;
    }
  };

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <h1>HR Dashboard</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
      </header>
      
      <nav style={styles.nav}>
        <button onClick={() => setActiveTab('profile')} style={styles.navButton(activeTab === 'profile')}>My Profile</button>
        <button onClick={() => setActiveTab('employees')} style={styles.navButton(activeTab === 'employees')}>Manage Employees</button>
        <button onClick={() => setActiveTab('roles')} style={styles.navButton(activeTab === 'roles')}>Manage Roles</button>
        <button onClick={() => setActiveTab('departments')} style={styles.navButton(activeTab === 'departments')}>Manage Departments</button>
        <button onClick={() => setActiveTab('payroll')} style={styles.navButton(activeTab === 'payroll')}>Payroll</button>
      </nav>
      
      <main style={styles.content}>
        {renderTabContent()}
      </main>
    </div>
  );
};

// --- STYLES --- 
// Added some basic inline styles to make the new layout work.
// You should move these to your CSS file.
const styles = {
  pageContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #eee',
    paddingBottom: '1rem',
  },
  nav: {
    display: 'flex',
    flexWrap: 'wrap' as 'wrap',
    gap: '10px',
    margin: '1.5rem 0',
    borderBottom: '1px solid #ddd',
    paddingBottom: '1rem'
  },
  navButton: (isActive: boolean): React.CSSProperties => ({
    padding: '10px 15px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    background: isActive ? '#007bff' : '#f0f0f0',
    color: isActive ? 'white' : '#333',
    fontWeight: isActive ? 600 : 400,
    fontSize: '0.9rem',
  }),
  content: {
    padding: '1rem',
    background: '#f9f9f9',
    borderRadius: '8px',
    minHeight: '60vh',
  },
  tabTitle: {
  marginTop: 0,
  borderBottom: '1px solid #eee',
  paddingBottom: '0.5rem',
  color: '#333', // <-- ADD THIS
},
  masterDetailLayout: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    gap: '1.5rem',
    minHeight: '50vh',
  },
  masterList: {
    borderRight: '1px solid #eee',
    paddingRight: '1.5rem',
    height: '100%',
    maxHeight: '60vh',
    overflowY: 'auto' as 'auto',
  },
  detailPanel: {
  paddingLeft: '1.5rem',
  color: '#333', // <-- ADD THIS
},
  listItem: (isActive: boolean): React.CSSProperties => ({
  padding: '1rem',
  border: '1px solid transparent',
  borderBottom: '1px solid #eee',
  cursor: 'pointer',
  borderRadius: '4px',
  backgroundColor: isActive ? '#e6f2ff' : 'transparent',
  borderColor: isActive ? '#007bff' : 'transparent',
  color: '#333', // <-- ADD THIS
}),
  addButton: {
    width: '100%',
    marginBottom: '1rem',
    background: '#28a745', // green
  },
  formLayout: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    gap: '1rem',
    maxWidth: '500px'
  }
};

export default HRPage;