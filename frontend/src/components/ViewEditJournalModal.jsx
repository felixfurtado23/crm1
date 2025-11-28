import React, { useState, useEffect } from 'react';

const ViewEditJournalModal = ({ journal, type, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    journalNumber: '',
    notes: '',
    currency: 'USD',
    entries: [{ account: '', description: '', debit: '', credit: '' }],
    attachments: []
  });
  const [accounts, setAccounts] = useState([]);
  const [currencies] = useState(['USD', 'EUR', 'GBP', 'JPY', 'CAD']);
  const API_BASE_URL = 'http://localhost:8000';

  useEffect(() => {
    fetchAccounts();
    if (journal && type !== 'create') {
      setFormData({
        ...journal,
        date: journal.date.split('T')[0]
      });
    } else if (type === 'create') {
      generateJournalNumber();
    }
  }, [journal, type]);

  const fetchAccounts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chart-of-accounts/`);
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const generateJournalNumber = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/manual-journals/last-number/`);
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          journalNumber: data.lastNumber + 1
        }));
      }
    } catch (error) {
      console.error('Error generating journal number:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEntryChange = (index, field, value) => {
    const updatedEntries = [...formData.entries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [field]: value
    };
    
    // Auto-clear the opposite field when one is filled
    if (field === 'debit' && value) {
      updatedEntries[index].credit = '';
    } else if (field === 'credit' && value) {
      updatedEntries[index].debit = '';
    }
    
    setFormData(prev => ({
      ...prev,
      entries: updatedEntries
    }));
  };

  const addEntry = () => {
    setFormData(prev => ({
      ...prev,
      entries: [...prev.entries, { account: '', description: '', debit: '', credit: '' }]
    }));
  };

  const removeEntry = (index) => {
    if (formData.entries.length > 1) {
      const updatedEntries = formData.entries.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        entries: updatedEntries
      }));
    }
  };

  const calculateTotals = () => {
    const totalDebits = formData.entries.reduce((sum, entry) => sum + parseFloat(entry.debit || 0), 0);
    const totalCredits = formData.entries.reduce((sum, entry) => sum + parseFloat(entry.credit || 0), 0);
    const difference = totalDebits - totalCredits;
    
    return {
      totalDebits,
      totalCredits,
      difference,
      isBalanced: difference === 0
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totals = calculateTotals();
    
    if (!totals.isBalanced) {
      alert('Journal entries must balance! Debits must equal Credits.');
      return;
    }

    if (formData.entries.some(entry => !entry.account)) {
      alert('All entries must have an account selected.');
      return;
    }

    try {
      const url = type === 'create' 
        ? `${API_BASE_URL}/api/manual-journals/create/`
        : `${API_BASE_URL}/api/manual-journals/${journal.id}/update/`;
      
      const method = type === 'create' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        alert(`Journal ${type === 'create' ? 'created' : 'updated'} successfully!`);
        onSave();
        onClose();
      } else {
        alert(`Error ${type === 'create' ? 'creating' : 'updating'} journal`);
      }
    } catch (error) {
      console.error(`Error ${type === 'create' ? 'creating' : 'updating'} journal:`, error);
      alert(`Error ${type === 'create' ? 'creating' : 'updating'} journal: ` + error.message);
    }
  };

  const totals = calculateTotals();

  return (
    <div className="modal-overlay active">
      <div className="modal-content">
         <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">Add New Journal</h2>
            <p className="modal-subtitle">Fill the details to add a new customer</p>
          </div>

          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>

        
          <div className="modal-body">
            {/* Basic Information */}
<div className="modal-form-section">
                <h4>Basic Information</h4>

            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  disabled={type === 'view'}
                  required
                />
              </div>
              <div className="form-group">
                <label>Journal Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={`JRN-${formData.journalNumber}`}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Currency</label>
                <select
                  className="form-control"
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  disabled={type === 'view'}
                  required
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>
            </div>



            <div className="form-group">
              <label>Notes</label>
              <textarea
                className="form-control"
                rows="3"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                disabled={type === 'view'}
                placeholder="Enter journal notes..."
              />
            </div>

            </div>



         <div className="expense-detail-section">
  <div className="expense-section-header">
    <h4>Journal Entries</h4>
    {type !== 'view' && (
      <button type="button" className="btn btn-outline with-icon" onClick={addEntry}>
        <i className="fas fa-plus"></i>
        Add Entry
      </button>
    )}
  </div>

  <div className="expense-entries-table-container">
    <table className="expense-entries-table">
      <thead>
        <tr>
          <th>Account</th>
          <th>Description</th>
          <th className="text-right">Debit</th>
          <th className="text-right">Credit</th>
          {type !== 'view' && <th width="60"></th>}
        </tr>
      </thead>
      <tbody>
        {formData.entries.map((entry, index) => (
          <tr key={index} className="expense-entry-row">
            <td>
              <select
                className="expense-form-control expense-account-select"
                value={entry.account}
                onChange={(e) => handleEntryChange(index, 'account', e.target.value)}
                disabled={type === 'view'}
                required
              >
                <option value="">Select Account</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.accountCode} - {account.accountName}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <input
                type="text"
                className="expense-form-control"
                value={entry.description}
                onChange={(e) => handleEntryChange(index, 'description', e.target.value)}
                disabled={type === 'view'}
                placeholder="Description"
              />
            </td>
            <td>
              <input
                type="number"
                className="expense-form-control text-right"
                step="0.01"
                min="0"
                value={entry.debit}
                onChange={(e) => handleEntryChange(index, 'debit', e.target.value)}
                disabled={type === 'view'}
                placeholder="0.00"
              />
            </td>
            <td>
              <input
                type="number"
                className="expense-form-control text-right"
                step="0.01"
                min="0"
                value={entry.credit}
                onChange={(e) => handleEntryChange(index, 'credit', e.target.value)}
                disabled={type === 'view'}
                placeholder="0.00"
              />
            </td>
            {type !== 'view' && formData.entries.length > 1 && (
              <td>
                <button
                  type="button"
                  className="expense-btn-remove-entry"
                  onClick={() => removeEntry(index)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

            

           

            {/* Totals Section */}
            <div className="totals-section">
              <div className="total-row">
                <span>Total Debits:</span>
                <span>{totals.totalDebits.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Total Credits:</span>
                <span>{totals.totalCredits.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Difference:</span>
                <span style={{ 
                  color: totals.difference === 0 ? '#2e7d32' : '#d32f2f',
                  fontWeight: 'bold'
                }}>
                  {totals.difference.toFixed(2)}
                </span>
              </div>
              <div className="total-row final">
                <span>Status:</span>
                <span style={{ 
                  color: totals.isBalanced ? '#2e7d32' : '#d32f2f'
                }}>
                  {totals.isBalanced ? 'BALANCED' : 'UNBALANCED'}
                </span>
              </div>
            </div>


 
            {/* Attachments */}
            <div className="expense-form-section">
                <h4>Attachments</h4>
                <div className="expense-file-upload-area">
                  <input
                    type="file"
                    className="expense-file-input"
                    multiple
                    onChange={(e) => handleInputChange('attachments', Array.from(e.target.files))}
                  />
                  <div className="expense-upload-placeholder">
                    <i className="fas fa-cloud-upload-alt"></i>
                    <p>Drop files here or click to upload</p>
                    <span>Supports PDF, JPG, PNG (Max 10MB each)</span>
                  </div>
                </div>
              </div>
          </div>

          <div className="form-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            {type !== 'view' && (
              <button type="submit" className="btn">
                {type === 'create' ? 'Create Journal' : 'Update Journal'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViewEditJournalModal;