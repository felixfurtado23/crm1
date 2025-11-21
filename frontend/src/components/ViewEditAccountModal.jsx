import React, { useState, useEffect } from 'react';

const ViewEditAccountModal = ({ account, type, onClose, onSave }) => {
  const isView = type === 'view';
  const [formData, setFormData] = useState({});
  const accountTypes = ['Asset', 'Liability', 'Equity', 'Income', 'Expense'];
  const API_BASE_URL = '';

  useEffect(() => {
    if (account) {
      // Convert vatApplicable from string to boolean for form
      setFormData({ 
        ...account, 
        vatApplicable: account.vatApplicable === 'Yes' 
      });
    }
  }, [account]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.accountCode || !formData.accountName) {
    alert('Please fill in account code and account name');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/chart-of-accounts/${account.id}/edit/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (response.ok) {
      const result = await response.json();
      alert(result.message || 'Account updated successfully!');
      onSave(); // This should refresh the accounts list
      onClose();
    } else if (response.status === 404) {
      alert('Account not found');
    } else {
      const errorData = await response.json();
      alert('Error updating account: ' + (errorData.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error updating account:', error);
    alert('Error updating account: ' + error.message);
  }
};

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isView ? 'Account Details' : 'Edit Account'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-body">
          {isView ? (
            <div className="account-details">
              <div className="detail-row">
                <strong>Account Code:</strong>
                <span>{account.accountCode}</span>
              </div>
              <div className="detail-row">
                <strong>Account Name:</strong>
                <span>{account.accountName}</span>
              </div>
              <div className="detail-row">
                <strong>Account Type:</strong>
                <span>{account.accountType}</span>
              </div>
              <div className="detail-row">
                <strong>Description:</strong>
                <span>{account.description || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <strong>VAT Applicable:</strong>
                <span>{account.vatApplicable}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Account Code *</label>
                  <input
                    type="number"
                    name="accountCode"
                    className="form-control"
                    value={formData.accountCode || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Account Name *</label>
                  <input
                    type="text"
                    name="accountName"
                    className="form-control"
                    value={formData.accountName || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Account Type *</label>
                  <select 
                    name="accountType" 
                    className="form-control" 
                    value={formData.accountType || ''} 
                    onChange={handleChange}
                    required
                  >
                    {accountTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>VAT Applicable</label>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="vatApplicable"
                        checked={formData.vatApplicable || false}
                        onChange={handleChange}
                      />
                      <span className="checkmark"></span>
                      This account is VAT applicable
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
            </form>
          )}
        </div>
        
        <div className="form-footer">
          <button className="btn btn-outline" onClick={onClose}>
            {isView ? 'Close' : 'Cancel'}
          </button>
          {!isView && (
            <button className="btn" onClick={handleSubmit}>Update Account</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewEditAccountModal;