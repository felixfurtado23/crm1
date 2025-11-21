import React from 'react';

const Level3Nav = ({ activeSubNav, activePage, setActivePage }) => {
  const getLevel3Items = () => {
    switch (activeSubNav) {
      case 'revenue':
        return [
          { label: 'Customers', page: 'customers' },
          { label: 'Invoicing', page: 'invoicing' }
        ];
      case 'expenses':
        return [
          { label: 'Vendors', page: 'vendors' },
          { label: 'Expense Input', page: 'expense-input' }
        ];
      case 'accounting':
        return [
          { label: 'Chart of Accounts', page: 'chart-of-accounts' },
          { label: 'Manual Journals', page: 'manual-journals' }
        ];
      default:
        return [];
    }
  };

  const level3Items = getLevel3Items();

  if (level3Items.length === 0) return null;

  return (
    <div className="level3-nav">
      {level3Items.map((item, index) => (
        <button
          key={index}
          className={`level3-nav-item ${activePage === item.page ? 'active' : ''}`}
          onClick={() => setActivePage(item.page)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Level3Nav;