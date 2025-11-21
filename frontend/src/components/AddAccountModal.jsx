import React, { useState } from 'react';

const AddAccountModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    accountCode: '',
    accountName: '',
    accountType: 'Asset',
    description: '',
    vatApplicable: false
  });

  const accountTypes = ['Asset', 'Liability', 'Equity', 'Income', 'Expense'];
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
      const response = await fetch(`${API_BASE_URL}/api/chart-of-accounts/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const savedAccount = await response.json();
        alert('Account added successfully!');
        onSave(savedAccount);
        onClose();
      } else {
        alert('Error adding account');
      }
    } catch (error) {
      console.error('Error adding account:', error);
      alert('Error adding account');
    }
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add New Account</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Account Code *</label>
                <input
                  type="number"
                  name="accountCode"
                  className="form-control"
                  value={formData.accountCode}
                  onChange={handleChange}
                  placeholder="e.g., 1000"
                  required
                />
              </div>
              <div className="form-group">
                <label>Account Name *</label>
                <input
                  type="text"
                  name="accountName"
                  className="form-control"
                  value={formData.accountName}
                  onChange={handleChange}
                  placeholder="e.g., Petty Cash"
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
                  value={formData.accountType} 
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
                      checked={formData.vatApplicable}
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
                value={formData.description}
                onChange={handleChange}
                placeholder="Account description..."
                rows="3"
              />
            </div>
          </form>
        </div>
        
        <div className="form-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={handleSubmit}>Save Account</button>
        </div>
      </div>
    </div>
  );
};

export default AddAccountModal;