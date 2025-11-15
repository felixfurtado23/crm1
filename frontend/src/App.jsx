import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Leads from './pages/Leads';
import Customers from './pages/Customers';
import Invoicing from './pages/Invoicing';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import './styles.css';

function App() {
  // Get saved tab from localStorage, default to 'Customers'
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'Dashboard';
  });

  // Save to localStorage whenever activeTab changes
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'Leads':
        return <Leads />;
      case 'Customers':
        return <Customers />;
      case 'Dashboard':
        return <Dashboard />;
      case 'Accounting':
        return <Invoicing/>;
      case 'Reports':
        return <Reports />;
      case 'Invoicing':
        return <Invoicing />;
      default:
        return <Customers />;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        <Topbar />
        
        <div className="module-tabs">
          <div 
            className={`module-tab ${activeTab === 'Dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('Dashboard')}
          >
            Dashboard
          </div>
          <div 
            className={`module-tab ${activeTab === 'Leads' ? 'active' : ''}`}
            onClick={() => setActiveTab('Leads')}
          >
            Leads
          </div>
          <div 
            className={`module-tab ${activeTab === 'Customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('Customers')}
          >
            Customers
          </div>
          <div 
            className={`module-tab ${activeTab === 'Accounting' ? 'active' : ''}`}
            onClick={() => setActiveTab('Accounting')}
          >
            Accounting
          </div>
          <div 
            className={`module-tab ${activeTab === 'Reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('Reports')}
          >
            Reports
          </div>
        </div>

        {renderContent()}
      </main>
    </div>
  );
}

export default App;