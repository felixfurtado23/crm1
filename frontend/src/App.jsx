import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Leads from './pages/Leads';
import Customers from './pages/Customers';
import Invoicing from './pages/Invoicing';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import ChartOfAccounts from './pages/ChartOfAccounts';
import ManualJournals from './pages/ManualJournals'; 
import Vendors from './pages/Vendors';
import ExpensesInput from './pages/ExpensesInput';
import PDFInvoiceProcessing from './pages/PDFInvoiceProcessing';
import InventoryManagement from './pages/InventoryManagement'; 
import Payroll from './pages/Payroll'; 
import AIChatbot from './pages/AIChatbot';
import './styles.css';

function App() {
  const [activeMainNav, setActiveMainNav] = useState(() => {
    return localStorage.getItem('activeMainNav') || 'reports';
  });

  const [activeSubNav, setActiveSubNav] = useState(() => {
    return localStorage.getItem('activeSubNav') || '';
  });

  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem('activePage') || '';
  });

  useEffect(() => {
    localStorage.setItem('activeMainNav', activeMainNav);
    localStorage.setItem('activeSubNav', activeSubNav);
    localStorage.setItem('activePage', activePage);
  }, [activeMainNav, activeSubNav, activePage]);

  // Set default page when sub-nav changes
  useEffect(() => {
    if (activeMainNav === 'operations' && activeSubNav) {
      let defaultPage = '';
      switch (activeSubNav) {
        case 'revenue':
          defaultPage = 'customers';
          break;
        case 'expenses':
          defaultPage = 'vendors';
          break;
        case 'accounting':
          defaultPage = 'chart-of-accounts';
          break;
        case 'inventory':
          defaultPage = 'inventory';
          break;
        case 'payroll': 
          defaultPage = 'payroll';
          break;
        default:
          defaultPage = '';
      }
      // Only set default page if no page is currently selected
      if (defaultPage && !activePage) {
        setActivePage(defaultPage);
      }
    }
  }, [activeMainNav, activeSubNav, activePage]);

  // Set default when switching to Operations
  useEffect(() => {
    if (activeMainNav === 'operations' && !activeSubNav) {
      setActiveSubNav('revenue');
      setActivePage('customers');
    }
  }, [activeMainNav, activeSubNav]);

  const renderContent = () => {
    // Direct pages (no sub-nav needed)
    if (activeMainNav === 'dashboard') return <Dashboard />;
    if (activeMainNav === 'reports') return <Reports />;
    if (activeMainNav === 'leads') return <Leads />;
    if (activeMainNav === 'pdf-invoices') return <PDFInvoiceProcessing />;
    if (activeMainNav === 'ai-chatbot') return <AIChatbot />;
    
    // Operations pages
    if (activeMainNav === 'operations') {
      switch (activePage) {
        case 'customers':
          return <Customers />;
        case 'invoicing':
          return <Invoicing />;
        case 'vendors':
          return <Vendors />;
        case 'expense-input':
          return <ExpensesInput />;
        case 'expenses-invoice': 
          return <PDFInvoiceProcessing/>;
        case 'chart-of-accounts':
          return <ChartOfAccounts />;
        case 'manual-journals':
          return <ManualJournals />; 
        case 'inventory':
          return <InventoryManagement />;
        case 'payroll': // Add payroll case
          return <Payroll />;
        default:
          // Show default page based on activeSubNav
          switch (activeSubNav) {
            case 'revenue':
              return <Customers />;
            case 'expenses':
              return <Vendors />;
            case 'accounting':
              return <ChartOfAccounts />;
            case 'inventory':
              return <InventoryManagement />;
            case 'payroll': // Add payroll case
              return <Payroll />;
            default:
              return <div className="page-placeholder">Select a section from Operations</div>;
          }
      }
    }

    return <Dashboard />;
  };

  return (
    <div className="dashboard">
      <Sidebar 
        activeMainNav={activeMainNav} 
        setActiveMainNav={setActiveMainNav}
        setActiveSubNav={setActiveSubNav}
        setActivePage={setActivePage}
      />
      
      <main className="main-content">
        <Topbar 
          activeMainNav={activeMainNav} 
          activeSubNav={activeSubNav}
          activePage={activePage}
          setActiveSubNav={setActiveSubNav}
          setActivePage={setActivePage}
        />

        {/* Main Content */}
        <div className="content-area">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;