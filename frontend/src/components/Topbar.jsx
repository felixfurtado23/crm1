import React from 'react';

const Topbar = () => {
  return (
    <header className="topbar">
      <div className="greeting">
        <h1>CRM & Accounting Dashboard</h1>
        <p>Manage your leads, customers, and finances in one place</p>
      </div>
      <div className="topbar-actions">
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search leads..." />
        </div>
        <div className="action-icons">
          <div className="action-icon">
            <i className="far fa-bell"></i>
            <div className="notification-badge">3</div>
          </div>
          <div className="action-icon">
            <i className="far fa-envelope"></i>
            <div className="notification-badge">7</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;