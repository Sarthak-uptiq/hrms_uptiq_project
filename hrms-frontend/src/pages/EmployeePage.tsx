// src/pages/EmployeePage.tsx
import React, { useState, useEffect } from 'react';
import {
  getEmployeeDetails,
  updateEmployeeDetails,
  updatePolicyAck,
  resignFromCompany,
  getPayrollData,
  initiateAIChat,
  type EmployeeDetails,
  type UpdateEmployeePayload,
} from '../api/employee';
import { useAuth } from '../context/AuthContext'; // Using the real auth hook
import './EmployeePage.css'; // Assuming you have this CSS file

const EmployeePage: React.FC = () => {
  const [employee, setEmployee] = useState<EmployeeDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<UpdateEmployeePayload>({});
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Use the real auth hook to get the logged-in user and logout function
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchDetails = async () => {
      // Check against the real user object
      if (!user) { 
        setError("Unauthorized. Please log in.");
        setIsLoading(false);
        return;
      }
      try {
        const data = await getEmployeeDetails();
        setEmployee(data);
        // Add fallbacks to prevent 'undefined' in form state
        setFormData({ 
          name: data.name || '', 
          city: data.city || '', 
          state: data.state || '', 
          pincode: data.pincode || '' 
        });
      } catch (err) {
        setError('Failed to fetch your details. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [user]); // Depend on the real user object

  const showMessage = (text: string, type: 'success' | 'error', duration = 4000) => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage(null), duration);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateEmployeeDetails(formData);
      setEmployee(prev => prev ? { ...prev, ...formData } : null);
      setIsEditing(false);
      showMessage('Your details have been updated!', 'success');
    } catch {
      showMessage('Failed to update details.', 'error');
    }
  };

  const handleAcknowledgePolicy = async () => {
    if (window.confirm("Do you acknowledge and agree to the company policies?")) {
      try {
        await updatePolicyAck();
        
        // --- FIX #1: Use the correct "ACKNOWLEDGED" string ---
        setEmployee(prev => prev ? { ...prev, policy_ack_status: 'ACKNOWLEDGED' } : null);
        
        showMessage('Policies acknowledged successfully.', 'success');
      } catch {
        showMessage('Could not acknowledge policies. Please try again.', 'error');
      }
    }
  };

  const handleResign = async () => {
    if (window.confirm("This action cannot be undone. Are you sure you want to submit your resignation?")) {
      try {
        await resignFromCompany();
        setEmployee(prev => prev ? { ...prev, status: 'INACTIVE' } : null);
        showMessage('Your resignation has been submitted.', 'success');
      } catch {
        showMessage('Resignation submission failed.', 'error');
      }
    }
  };
  
  const handleViewPayroll = async () => {
    try {
      await getPayrollData();
      // This will likely fail since the API doesn't exist, and the catch block will run:
      showMessage('Payroll data viewed (placeholder success).', 'success');
    } catch (err: any) {
      showMessage(err.message || 'Could not get payroll data.', 'error');
    }
  };

  const handleChatClick = () => {
    alert("Redirecting to AI Chat Portal...");
    initiateAIChat(); // Fire-and-forget
  };

  if (isLoading) return <div className="status-container">Loading...</div>;
  if (error) return <div className="status-container error">{error}</div>;
  if (!employee) return <div className="status-container">No employee data found.</div>;

  return (
    <div className="employee-dashboard">
      <header className="dashboard-header">
        {/* Fallback for name is included */}
        <h1>Welcome, {(employee.name || "User").split(' ')[0]}</h1>
        <button onClick={logout} className="logout-btn" style={{padding: '8px 16px', cursor: 'pointer'}}>Logout</button>
      </header>
      {actionMessage && <div className={`action-message ${actionMessage.type}`}>{actionMessage.text}</div>}
      <div className="dashboard-grid">
        <div className="card">
          <h2>Personal Information</h2>
          {!isEditing ? (
            <div className="display-info">
              {/* Added safe fallbacks for display */}
              <p><strong>Name:</strong> {employee.name || 'N/A'}</p>
              <p><strong>Email:</strong> {employee.email || 'N/A'}</p>
              <p><strong>Location:</strong> {`${employee.city || 'N/A'}, ${employee.state || ''} - ${employee.pincode || ''}`}</p>
              <button onClick={() => setIsEditing(true)}>Edit Details</button>
            </div>
          ) : (
            <form onSubmit={handleUpdateDetails}>
              <label>Name: <input type="text" name="name" value={formData.name} onChange={handleInputChange} /></label>
              <label>City: <input type="text" name="city" value={formData.city} onChange={handleInputChange} /></label>
              <label>State: <input type="text" name="state" value={formData.state} onChange={handleInputChange} /></label>
              <label>Pincode: <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} /></label>
              <div className="form-buttons">
                <button type="submit">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>

        {/* --- THIS BLOCK IS FULLY CORRECTED --- */}
        <div className="card">
          <h2>Employment Details</h2>
          <p><strong>Department:</strong> {employee.department?.dep_name || 'N/A'}</p>
          <p><strong>Role:</strong> {employee.role?.role_name || 'N/A'}</p>
          
          <p><strong>Status:</strong> 
            <span className={`status-badge status-${(employee.status || 'inactive').toLowerCase()}`}>
              {employee.status || 'N/A'}
            </span>
          </p>
          
          <p><strong>Policy Status:</strong> 
            <span className={`status-badge status-${(employee.policy_ack_status || 'pending').toLowerCase().replace('_', '-')}`}>
              
              {/* --- FIX #2: Use the correct "ACKNOWLEDGED" string --- */}
              {employee.policy_ack_status === 'ACKNOWLEDGED' ? 'Acknowledged' 
                : employee.policy_ack_status === 'PENDING' ? 'Pending' 
                : 'Not Acknowledged'}
            </span>
          </p>
        </div>

        {/* --- THIS BLOCK IS FULLY CORRECTED --- */}
        <div className="card">
          <h2>Compensation (Read-Only)</h2>
          <p><strong>Total CTC:</strong> ₹{(employee.role?.total_ctc || 0).toLocaleString('en-IN')}</p>
          <p><strong>Base Salary:</strong> ₹{(employee.role?.base_salary || 0).toLocaleString('en-IN')}</p>
          <p><strong>Bonus:</strong> ₹{(employee.role?.bonus || 0).toLocaleString('en-IN')}</p>
          <p><strong>Allowances:</strong> ₹{(employee.role?.allowance || 0).toLocaleString('en-IN')}</p>
        </div>

        {/* --- THIS BLOCK IS FULLY CORRECTED --- */}
        <div className="card">
          <h2>Actions</h2>
          <div className="actions-container">
            
            {/* --- FIX #3: Use the correct "ACKNOWLEDGED" string --- */}
            {employee.policy_ack_status !== 'ACKNOWLEDGED' && <button onClick={handleAcknowledgePolicy}>Acknowledge Policies</button>}
            
            <button onClick={handleViewPayroll}>View Payroll</button>
            
            {employee.status === 'ACTIVE' && <button className="resign-btn" onClick={handleResign}>Resign</button>}
          </div>
        </div>
      </div>
      <div className="chat-fab" onClick={handleChatClick} title="Chat with AI Assistant">💬</div>
    </div>
  );
};

export default EmployeePage;