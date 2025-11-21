import React, { useState, useEffect } from 'react';
import ChartOfAccountsTable from '../components/ChartOfAccountsTable';
import AddAccountModal from '../components/AddAccountModal';

const ChartOfAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = '';

  useEffect(() => {
    fetchAccounts();
  }, []);

const fetchAccounts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chart-of-accounts/`);
    if (response.ok) {
      const data = await response.json();
      setAccounts(data);
    } else {
      console.error('Failed to fetch accounts');
    }
  } catch (error) {
    console.error('Error fetching accounts:', error);
  } finally {
    setLoading(false);
  }
};

const addAccount = (newAccount) => {
  setAccounts([...accounts, newAccount]);
  setShowAddModal(false);
};

  if (loading) {
    return <div>Loading chart of accounts...</div>;
  }

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">Chart of Accounts</div>
        <button className="btn" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus"></i> Add Account
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-value">{accounts.filter(a => a.accountType === 'Asset').length}</div>
          <div className="summary-label">Asset Accounts</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{accounts.filter(a => a.accountType === 'Liability').length}</div>
          <div className="summary-label">Liability Accounts</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{accounts.filter(a => a.accountType === 'Equity').length}</div>
          <div className="summary-label">Equity Accounts</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{accounts.filter(a => a.accountType === 'Income').length}</div>
          <div className="summary-label">Income Accounts</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{accounts.filter(a => a.accountType === 'Expense').length}</div>
          <div className="summary-label">Expense Accounts</div>
        </div>
        <div className="summary-card total">
          <div className="summary-value">{accounts.length}</div>
          <div className="summary-label">Total Accounts</div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="data-table-container">
        <ChartOfAccountsTable accounts={accounts} onAccountUpdate={fetchAccounts} />
      </div>

      {showAddModal && (
        <AddAccountModal 
          onClose={() => setShowAddModal(false)}
          onSave={addAccount}
        />
      )}
    </>
  );
};

export default ChartOfAccounts;