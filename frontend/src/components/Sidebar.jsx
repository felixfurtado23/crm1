import React from 'react';

const Sidebar = ({ activeMainNav, setActiveMainNav, setActiveSubNav, setActivePage }) => {
  const mainNavItems = [
    { icon: 'fas fa-chart-pie', label: 'Business Dashboards', nav: 'dashboard' },
    { icon: 'fas fa-users', label: 'Leads', nav: 'leads' },
    { icon: 'fas fa-cogs', label: 'Operations', nav: 'operations' },
    { label: 'AI Assistant', nav: 'ai-chatbot', icon: 'fas fa-robot' },
    { icon: 'fas fa-chart-bar', label: 'Reports', nav: 'reports' },

  ];

  const handleMainNavClick = (nav) => {
    setActiveMainNav(nav);
    
    if (nav === 'operations') {
      // Set default to Revenue → Customers when switching to Operations
      setActiveSubNav('revenue');
      setActivePage('customers');
    } else {
      // Reset for other sections
      setActiveSubNav('');
      setActivePage('');
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-icons">
        {mainNavItems.map((item, index) => (
          <div key={index} className="sidebar-icon-container">
            <button 
              className={`sidebar-icon ${activeMainNav === item.nav ? 'active' : ''}`}
              onClick={() => handleMainNavClick(item.nav)}
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