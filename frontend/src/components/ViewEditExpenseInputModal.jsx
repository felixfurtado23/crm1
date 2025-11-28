import React, { useState, useEffect } from 'react';

const ViewEditExpenseInputModal = ({ expense, type, onClose, onSave, accounts }) => {
  const isView = type === 'view';
  const isCreate = type === 'create';
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    expenseNumber: '',
    vendor: '',
    vendorContact: '',
    vendorPhone: '',
    notes: '',
    currency: 'USD',
    entries: [{ account: '', description: '', debit: '', credit: '' }],
    attachments: []
  });

  const [currencies] = useState(['USD', 'EUR', 'GBP', 'AED', 'CAD']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (expense && !isCreate) {
      setFormData({
        ...expense,
        date: expense.date.split('T')[0]
      });
    } else if (isCreate) {
      setFormData(prev => ({
        ...prev,
        expenseNumber: Math.floor(1000 + Math.random() * 9000).toString()
      }));
    }
  }, [expense, isCreate]);

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
      isBalanced: Math.abs(difference) < 0.01
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const totals = calculateTotals();
    
    if (!totals.isBalanced) {
      alert('Expense entries must balance! Debits must equal Credits.');
      setIsSubmitting(false);
      return;
    }

    if (formData.entries.some(entry => !entry.account)) {
      alert('All entries must have an account selected.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.vendor.trim()) {
      alert('Vendor name is required.');
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      onSave(formData);
      setIsSubmitting(false);
    }, 1000);
  };

  const totals = calculateTotals();
  const getAccountName = (accountId) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account ? `${account.accountCode} - ${account.accountName}` : 'Unknown Account';
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content " onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">Add Expenses Input</h2>
            <p className="modal-subtitle">Fill the required details</p>
          </div>

          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="modal-body">
          {isView ? (
            // View Mode
            <div className="expense-details-view">
              <div className="expense-detail-grid">
                <div className="expense-detail-item">
                  <label>Expense Number</label>
                  <div className="expense-detail-value">
                    <span className="expense-number-display">EXP-{expense.expenseNumber}</span>
                  </div>
                </div>
                <div className="expense-detail-item">
                  <label>Date</label>
                  <div className="expense-detail-value">
                    {new Date(expense.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
                <div className="expense-detail-item">
                  <label>Currency</label>
                  <div className="expense-detail-value">
                    <span className="expense-currency-display">{expense.currency}</span>
                  </div>
                </div>
                <div className="expense-detail-item">
                  <label>Status</label>
                  <div className="expense-detail-value">
                    <span className={`expense-status-badge expense-status-${expense.status.toLowerCase()}`}>
                      {expense.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="expense-detail-section">
                <h4>Vendor Information</h4>
                <div className="expense-detail-grid">
                  <div className="expense-detail-item">
                    <label>Vendor Name</label>
                    <div className="expense-detail-value expense-vendor-display">
                      {expense.vendor}
                    </div>
                  </div>
                  <div className="expense-detail-item">
                    <label>Contact Email</label>
                    <div className="expense-detail-value">{expense.vendorContact || 'N/A'}</div>
                  </div>
                  <div className="expense-detail-item">
                    <label>Phone</label>
                    <div className="expense-detail-value">{expense.vendorPhone || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {expense.notes && (
                <div className="expense-detail-section">
                  <label>Notes</label>
                  <div className="expense-notes-content">
                    {expense.notes}
                  </div>
                </div>
              )}

              <div className="expense-detail-section">
                <h4>Expense Entries</h4>
                <div className="expense-entries-table-container">
                  <table className="expense-entries-table">
                    <thead>
                      <tr>
                        <th>Account</th>
                        <th>Description</th>
                        <th className="text-right">Debit</th>
                        <th className="text-right">Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expense.entries.map((entry, index) => (
                        <tr key={index} className="expense-entry-row">
                          <td>
                            <div className="expense-account-info">
                              <div className="expense-account-name">{getAccountName(entry.account)}</div>
                            </div>
                          </td>
                          <td>
                            <div className="expense-entry-description">
                              {entry.description || 'No description'}
                            </div>
                          </td>
                          <td className="text-right">
                            {entry.debit ? (
                              <span className="expense-amount debit">{parseFloat(entry.debit).toFixed(2)}</span>
                            ) : (
                              <span className="expense-amount zero">-</span>
                            )}
                          </td>
                          <td className="text-right">
                            {entry.credit ? (
                              <span className="expense-amount credit">{parseFloat(entry.credit).toFixed(2)}</span>
                            ) : (
                              <span className="expense-amount zero">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="expense-totals-section">
                <div className="expense-total-row">
                  <span>Total Debits:</span>
                  <span className="expense-amount total-debit">{totals.totalDebits.toFixed(2)}</span>
                </div>
                <div className="expense-total-row">
                  <span>Total Credits:</span>
                  <span className="expense-amount total-credit">{totals.totalCredits.toFixed(2)}</span>
                </div>
                <div className="expense-total-row expense-difference-row">
                  <span>Difference:</span>
                  <span className={`expense-amount difference ${totals.isBalanced ? 'balanced' : 'unbalanced'}`}>
                    {totals.difference.toFixed(2)}
                  </span>
                </div>
                <div className="expense-total-row expense-final-row">
                  <span>Status:</span>
                  <span className={`expense-balance-status ${totals.isBalanced ? 'balanced' : 'unbalanced'}`}>
                    {totals.isBalanced ? '✓ BALANCED' : '✗ UNBALANCED'}
                  </span>
                </div>
              </div>

              {expense.attachments && expense.attachments.length > 0 && (
                <div className="expense-detail-section">
                  <h4>Attachments</h4>
                  <div className="attachments-list">
                    {expense.attachments.map((file, index) => (
                      <div key={index} className="attachment-item">
                        <div className="attachment-icon">
                          <i className="fas fa-paperclip"></i>
                        </div>
                        <div className="attachment-info">
                          <div className="attachment-name">{file.name}</div>
                          <div className="attachment-size">
                            {file.size ? `(${(file.size / 1024).toFixed(1)} KB)` : ''}
                          </div>
                        </div>
                        <button className="attachment-download" title="Download attachment">
                          <i className="fas fa-download"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Edit/Create Mode
            <form onSubmit={handleSubmit} className="expense-form">
              <div className="expense-form-section">
                <h4>Basic Information</h4>
                <div className="expense-form-row">
                  <div className="expense-form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      className="expense-form-control"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      required
                    />
                  </div>
                  <div className="expense-form-group">
                    <label>Expense Number</label>
                    <input
                      type="text"
                      className="expense-form-control"
                      value={`EXP-${formData.expenseNumber}`}
                      disabled
                    />
                  </div>
                  <div className="expense-form-group">
                    <label>Currency *</label>
                    <select
                      className="expense-form-control"
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      required
                    >
                      {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="expense-form-section">
                <h4>Vendor Details</h4>
                <div className="expense-form-row">
                  <div className="expense-form-group">
                    <label>Vendor Name *</label>
                    <input
                      type="text"
                      className="expense-form-control"
                      value={formData.vendor}
                      onChange={(e) => handleInputChange('vendor', e.target.value)}
                      placeholder="Enter vendor name"
                      required
                    />
                  </div>
                  <div className="expense-form-group">
                    <label>Contact Email</label>
                    <input
                      type="email"
                      className="expense-form-control"
                      value={formData.vendorContact}
                      onChange={(e) => handleInputChange('vendorContact', e.target.value)}
                      placeholder="vendor@company.com"
                    />
                  </div>
                  <div className="expense-form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      className="expense-form-control"
                      value={formData.vendorPhone}
                      onChange={(e) => handleInputChange('vendorPhone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="expense-form-group">
                  <label>Notes</label>
                  <textarea
                    className="expense-form-control"
                    rows="3"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Enter expense description or notes..."
                  />
                </div>
              </div>

              <div className="expense-form-section">
                <div className="expense-section-header">
                  <h4>Expense Entries *</h4>
                  <button type="button" className="btn btn-outline with-icon" onClick={addEntry}>
                    <i className="fas fa-plus"></i>
                    Add Entry
                  </button>
                </div>
                
                <div className="expense-entries-editor">
                  <div className="expense-entries-table-container">
                    <table className="expense-entries-table editable">
                      <thead>
                        <tr>
                          <th>Account *</th>
                          <th>Description</th>
                          <th className="text-right">Debit</th>
                          <th className="text-right">Credit</th>
                          <th width="60"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.entries.map((entry, index) => (
                          <tr key={index} className="expense-entry-row editable">
                            <td>
                              <select
                                className="expense-form-control expense-account-select"
                                value={entry.account}
                                onChange={(e) => handleEntryChange(index, 'account', e.target.value)}
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
                                placeholder="Entry description..."
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
                                placeholder="0.00"
                              />
                            </td>
                            <td>
                              {formData.entries.length > 1 && (
                                <button
                                  type="button"
                                  className="expense-btn-remove-entry"
                                  onClick={() => removeEntry(index)}
                                  title="Remove entry"
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="expense-totals-section">
                <div className="expense-total-row">
                  <span>Total Debits:</span>
                  <span className="expense-amount total-debit">{totals.totalDebits.toFixed(2)}</span>
                </div>
                <div className="expense-total-row">
                  <span>Total Credits:</span>
                  <span className="expense-amount total-credit">{totals.totalCredits.toFixed(2)}</span>
                </div>
                <div className="expense-total-row expense-difference-row">
                  <span>Difference:</span>
                  <span className={`expense-amount difference ${totals.isBalanced ? 'balanced' : 'unbalanced'}`}>
                    {totals.difference.toFixed(2)}
                  </span>
                </div>
                <div className="expense-total-row expense-final-row">
                  <span>Status:</span>
                  <span className={`expense-balance-status ${totals.isBalanced ? 'balanced' : 'unbalanced'}`}>
                    {totals.isBalanced ? '✓ BALANCED' : '✗ UNBALANCED'}
                  </span>
                </div>
              </div>

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
            </form>
          )}
        </div>
        
        <div className="modal-footer ">
          <button 
            className="btn btn-outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            {isView ? 'Close' : 'Cancel'}
          </button>
          {!isView && (
            <button 
              className="btn btn-primary with-icon" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  {isCreate ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  {isCreate ? 'Create Expense' : 'Update Expense'}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewEditExpenseInputModal;