import React, { useState, useEffect } from 'react';

const ViewEditJournalModal = ({ journal, type, onClose, onSave, accounts }) => {
  const isView = type === 'view';
  const isCreate = type === 'create';
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    journalNumber: '',
    notes: '',
    currency: 'USD',
    entries: [{ account: '', description: '', debit: '', credit: '' }],
    attachments: []
  });

  const [currencies] = useState(['USD', 'EUR', 'GBP', 'AED', 'CAD']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (journal && !isCreate) {
      setFormData({
        ...journal,
        date: journal.date.split('T')[0]
      });
    } else if (isCreate) {
      // Generate a temporary journal number for new entries
      setFormData(prev => ({
        ...prev,
        journalNumber: Math.floor(1000 + Math.random() * 9000).toString()
      }));
    }
  }, [journal, isCreate]);

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
      isBalanced: Math.abs(difference) < 0.01
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const totals = calculateTotals();
    
    if (!totals.isBalanced) {
      alert('Journal entries must balance! Debits must equal Credits.');
      setIsSubmitting(false);
      return;
    }

    if (formData.entries.some(entry => !entry.account)) {
      alert('All entries must have an account selected.');
      setIsSubmitting(false);
      return;
    }

    // Simulate API call delay
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
      <div className="modal-content journal-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">
              {isView ? 'Journal Entry Details' : isCreate ? 'Create New Journal Entry' : 'Edit Journal Entry'}
            </h2>
            <p className="modal-subtitle">
              {isView ? 'View journal entry details and accounting impact' : 
               isCreate ? 'Create a new manual journal entry' : 'Edit existing journal entry'}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-body">
          {isView ? (
            // View Mode
            <div className="journal-details-view">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Journal Number</label>
                  <div className="detail-value">
                    <span className="journal-number-display">JRN-{journal.journalNumber}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <label>Date</label>
                  <div className="detail-value">
                    {new Date(journal.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
                <div className="detail-item">
                  <label>Currency</label>
                  <div className="detail-value">
                    <span className="currency-display">{journal.currency}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <div className="detail-value">
                    <span className={`journal-status-badge status-${journal.status.toLowerCase()}`}>
                      {journal.status}
                    </span>
                  </div>
                </div>
              </div>

              {journal.notes && (
                <div className="detail-section">
                  <label>Notes</label>
                  <div className="notes-content">
                    {journal.notes}
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h4>Journal Entries</h4>
                <div className="entries-table-container">
                  <table className="entries-table">
                    <thead>
                      <tr>
                        <th>Account</th>
                        <th>Description</th>
                        <th className="text-right">Debit</th>
                        <th className="text-right">Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {journal.entries && journal.entries.length > 0 ? (
                        journal.entries.map((entry, index) => (
                          <tr key={index} className="entry-row">
                            <td>
                              <div className="account-info">
                                <div className="account-name">{getAccountName(entry.account)}</div>
                              </div>
                            </td>
                            <td>
                              <div className="entry-description">
                                {entry.description || 'No description'}
                              </div>
                            </td>
                            <td className="text-right">
                              {entry.debit ? (
                                <span className="amount debit">{parseFloat(entry.debit).toFixed(2)}</span>
                              ) : (
                                <span className="amount zero">-</span>
                              )}
                            </td>
                            <td className="text-right">
                              {entry.credit ? (
                                <span className="amount credit">{parseFloat(entry.credit).toFixed(2)}</span>
                              ) : (
                                <span className="amount zero">-</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No journal entries found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="totals-section">
                <div className="total-row">
                  <span>Total Debits:</span>
                  <span className="amount total-debit">{totals.totalDebits.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Total Credits:</span>
                  <span className="amount total-credit">{totals.totalCredits.toFixed(2)}</span>
                </div>
                <div className="total-row difference-row">
                  <span>Difference:</span>
                  <span className={`amount difference ${totals.isBalanced ? 'balanced' : 'unbalanced'}`}>
                    {totals.difference.toFixed(2)}
                  </span>
                </div>
                <div className="total-row final-row">
                  <span>Status:</span>
                  <span className={`balance-status ${totals.isBalanced ? 'balanced' : 'unbalanced'}`}>
                    {totals.isBalanced ? '✓ BALANCED' : '✗ UNBALANCED'}
                  </span>
                </div>
              </div>

              {journal.attachments && journal.attachments.length > 0 && (
                <div className="detail-section">
                  <h4>Attachments</h4>
                  <div className="attachments-list">
                    {journal.attachments.map((file, index) => (
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
            <form onSubmit={handleSubmit} className="journal-form">
               <div className="modal-form-section">
             
                <h4>Basic Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
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
                    <label>Currency *</label>
                    <select
                      className="form-control"
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

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Enter journal notes or description..."
                  />
                </div>
              </div>

               <div className="modal-form-section">
                <div className="section-header">
                  <h4>Journal Entries *</h4>
                  <button type="button" className="btn btn-outline with-icon" onClick={addEntry}>
                    <i className="fas fa-plus"></i>
                    Add Entry
                  </button>
                </div>
                <br></br>
                
                <div className="entries-editor">
                  <div className="entries-table-container">
                    <table className="entries-table editable">
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
                          <tr key={index} className="entry-row editable">
                            <td>
                              <select
                                className="form-control account-select"
                                value={entry.account}
                                onChange={(e) => handleEntryChange(index, 'account', e.target.value)}
                                required
                              >
                                <option value="">Select Account</option>
                                {accounts && accounts.map(account => (
                                  <option key={account.id} value={account.id}>
                                    {account.accountCode} - {account.accountName}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={entry.description}
                                onChange={(e) => handleEntryChange(index, 'description', e.target.value)}
                                placeholder="Entry description..."
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control text-right"
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
                                className="form-control text-right"
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
                                  className="btn-remove-entry"
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

           <div className="modal-form-section">
                <h4>Total</h4>
                <div className="total-row">
                  <span>Total Debits:</span>
                  <span className="amount total-debit">{totals.totalDebits.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Total Credits:</span>
                  <span className="amount total-credit">{totals.totalCredits.toFixed(2)}</span>
                </div>
                <div className="total-row difference-row">
                  <span>Difference:</span>
                  <span className={`amount difference ${totals.isBalanced ? 'balanced' : 'unbalanced'}`}>
                    {totals.difference.toFixed(2)}
                  </span>
                </div>
                <div className="total-row final-row">
                  <span>Status:</span>
                  <span className={`balance-status ${totals.isBalanced ? 'balanced' : 'unbalanced'}`}>
                    {totals.isBalanced ? '✓ BALANCED' : '✗ UNBALANCED'}
                  </span>
                </div>
              </div>

         
            </form>
          )}
        </div>
        
        <div className="modal-footer">
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
                  {isCreate ? 'Create Journal' : 'Update Journal'}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewEditJournalModal;