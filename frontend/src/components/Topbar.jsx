import React from 'react';

const Topbar = ({ activeMainNav, activeSubNav, activePage, setActiveSubNav, setActivePage }) => {
  const getSubNavItems = () => {
    switch (activeMainNav) {
      case 'operations':
        return [
          { label: 'Revenue', nav: 'revenue', icon: 'fas fa-chart-line' },
          { label: 'Expenses', nav: 'expenses', icon: 'fas fa-receipt' },
          { label: 'Accounting', nav: 'accounting', icon: 'fas fa-calculator' },
          { label: 'Inventory', nav: 'inventory', icon: 'fas fa-boxes' },
          { label: 'Payroll WPS', nav: 'payroll', icon: 'fas fa-money-check' } 

        ];
      default:
        return [];
    }
  };
 
  const getLevel3Items = () => {
    switch (activeSubNav) {
      case 'revenue':
        return [
          { label: 'Customers', page: 'customers', icon: 'fas fa-users' },
          { label: 'Invoicing', page: 'invoicing', icon: 'fas fa-file-invoice' }
        ];
      case 'expenses':
        return [
          { label: 'Vendors', page: 'vendors', icon: 'fas fa-truck' },
          { label: 'Expense Input', page: 'expense-input', icon: 'fas fa-money-bill-wave' },
          { label: 'Expenses Invoice', page: 'expenses-invoice', icon: 'fas fa-file-invoice-dollar' }
        ];
      case 'accounting':
        return [
          { label: 'Chart of Accounts', page: 'chart-of-accounts', icon: 'fas fa-sitemap' },
          { label: 'Manual Journals', page: 'manual-journals', icon: 'fas fa-book' }
        ];

       case 'inventory': // Added Inventory level 3 items
        return [
          { label: 'Inventory Management', page: 'inventory', icon: 'fas fa-boxes' },
        ];


        case 'payroll': // Added Inventory level 3 items
        return [
          { label: 'Payroll WPS Management', page: 'payroll', icon: 'fas fa-money-check' },
        ];

       
      default:
        return [];
    }
  };

  const handleSubNavClick = (nav) => {
    setActiveSubNav(nav);
    
    // Set default page when sub-nav changes
    let defaultPage = '';
    switch (nav) {
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
    
    if (defaultPage) {
      setActivePage(defaultPage);
    }
  };

  const handlePageClick = (page) => {
    setActivePage(page);
  };

  const subNavItems = getSubNavItems();
  const level3Items = getLevel3Items();

  // Don't show any navigation for Leads section
  if (activeMainNav === 'leads') {
    return (
      <header className="topbar">
        <div className="greeting">
          <h1>CRM & Accounting Dashboard</h1>
          <p>Manage your leads, customers, and finances in one place</p>
        </div>
        <div className="topbar-actions">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search..." />
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
  }

  return (
    <>
      {/* Original Topbar Header */}
      <header className="topbar">
        <div className="greeting">
          <h1>CRM & Accounting Dashboard</h1>
          <p>Manage your leads, customers, and finances in one place</p>
        </div>
        <div className="topbar-actions">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search..." />
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

      {/* Navigation Section - Only for Operations */}
      {subNavItems.length > 0 && (
        <div className="nav-section">
          {/* Level 2 - Modern Section Headings */}
          <div className="modern-section-headings">
            {subNavItems.map((item, index) => (
              <button
                key={index}
                className={`modern-section-btn ${activeSubNav === item.nav ? 'active' : ''}`}
                onClick={() => handleSubNavClick(item.nav)}
              >
                <div className="section-icon-wrapper">
                  <i className={item.icon}></i>
                </div>
                <span className="section-label">{item.label}</span>
                <div className="section-indicator"></div>
              </button>
            ))}
          </div>

          {/* Level 3 - Modern Navigation */}
          {level3Items.length > 0 && (
            <nav className="modern-nav">
              <div className="modern-nav-container">
                {level3Items.map((item, index) => (
                  <button
                    key={index}
                    className={`modern-nav-item ${activePage === item.page ? 'active' : ''}`}
                    onClick={() => handlePageClick(item.page)}
                  >
                    <div className="nav-icon-wrapper">
                      <i className={item.icon}></i>
                    </div>
                    <span className="modern-nav-label">{item.label}</span>
                    <div className="modern-nav-indicator"></div>
                  </button>
                ))}
              </div>
            </nav>
          )}
        </div>
      )}
    </>
  );
};

export default Topbar;