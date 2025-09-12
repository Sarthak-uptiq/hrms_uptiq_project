import React from 'react';
import { KPICards } from '../features/hr-dashboard/KPICards';
import { Recruitment } from '../features/hr-dashboard/Recruitment';
import { CompanySettings } from '../features/hr-dashboard/CompanySettings';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';

const HRDashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar
        links={[
          { label: 'Dashboard', href: '/hr' },
          { label: 'Employees', href: '/employees' },
          { label: 'Recruitment', href: '/hr/recruitment' },
          { label: 'Settings', href: '/settings' },
        ]}
        active="/hr"
      />
      <div className="flex-1">
        <Navbar />
        <main className="p-6 space-y-8">
          <KPICards />
          <Recruitment />
          <CompanySettings />
        </main>
      </div>
    </div>
  );
};

export default HRDashboard;
