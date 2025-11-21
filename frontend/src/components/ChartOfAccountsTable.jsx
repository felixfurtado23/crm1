import React, { useState } from 'react';
import ViewEditAccountModal from './ViewEditAccountModal';

const ChartOfAccountsTable = ({ accounts, onAccountUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [modalType, setModalType] = useState('view');
  const API_BASE_URL = '';

  const getAccountTypeColor = (type) => {
    const colors = {
      Asset: '#e3f2fd',
      Liability: '#ffebee',
      Equity: '#e8f5e9',
      Income: '#f3e5f5',
      Expense: '#fff3e0'
    };
    return colors[type] || '#f5f5f5';
  };

  const handleAction = (action, account) => {
    setSelectedAccount(account);
    setModalType(action);
    setShowModal(true);
  };

  const handleDelete = async (accountId) => {
  if (confirm('Are you sure you want to delete this account?')) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chart-of-accounts/${accountId}/delete/`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        alert('Account deleted successfully!');
        onAccountUpdate(); // This should refresh the accounts list
      } else if (response.status === 404) {
        alert('Account not found');
      } else {
        const errorData = await response.json();
        alert('Error deleting account: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Error deleting account: ' + error.message);
    }
  }
};

  return (
    <>
      <table className="data-table">
        <thead>
          <tr>
            <th>Account Code</th>
            <th>Account Name</th>
            <th>Account Type</th>
            <th>Description</th>
            <th>VAT Applicable</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => (
            <tr key={account.id}>
              <td>
                <span className="account-code">{account.accountCode}</span>
              </td>
              <td>
                <strong>{account.accountName}</strong>
              </td>
              <td>
                <span 
                  className="account-type-badge"
                  style={{ backgroundColor: getAccountTypeColor(account.accountType) }}
                >
                  {account.accountType}
                </span>
              </td>
              <td>
                <span className="account-description">{account.description}</span>
              </td>
              <td>
                <span className={`vat-badge ${account.vatApplicable === 'Yes' ? 'vat-yes' : 'vat-no'}`}>
                  {account.vatApplicable}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button 
                    className="action-btn view" 
                    onClick={() => handleAction('view', account)}
                  >
                    <i className="fas fa-eye"></i> 
                  </button>
                  <button 
                    className="action-btn edit" 
                    onClick={() => handleAction('edit', account)}
                  >
                    <i className="fas fa-edit"></i> 
                  </button>
                  <button 
                    className="action-btn delete" 
                    onClick={() => handleDelete(account.id)}
                  >
                    <i className="fas fa-trash"></i> 
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedAccount && (
        <ViewEditAccountModal 
          account={selectedAccount}
          type={modalType}
          onClose={() => {
            setShowModal(false);
            setSelectedAccount(null);
          }}
          onSave={onAccountUpdate}
        />
      )}
    </>
  );
};

export default ChartOfAccountsTable;