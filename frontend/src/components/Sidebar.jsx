import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { icon: 'fas fa-chart-pie', label: 'Dashboard', tab: 'Dashboard' },
    { icon: 'fas fa-users', label: 'Leads', tab: 'Leads' },
    { icon: 'fas fa-user-check', label: 'Customers', tab: 'Customers' },
    { icon: 'fas fa-file-invoice-dollar', label: 'Accounting', tab: 'Invoicing' },
    { icon: 'fas fa-chart-bar', label: 'Reports', tab: 'Reports' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-icons">
        {menuItems.map((item, index) => (
          <div key={index} className="sidebar-icon-container">
            <button 
              className={`sidebar-icon ${activeTab === item.tab ? 'active' : ''}`}
              onClick={() => setActiveTab(item.tab)}
            >
              <i className={item.icon}></i>
            </button>
            <div className="sidebar-label">{item.label}</div>
          </div>
        ))}
      </div>
      <div className="user-avatar">
        <i className="fas fa-user"></i>
      </div>
    </aside>
  );
};

export default Sidebar;