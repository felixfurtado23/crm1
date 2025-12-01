import React, { useState, useEffect } from 'react';

const ViewEditExpenseInputModal = ({ expense, type, onClose, onSave }) => {
  const isView = type === 'view';
  const isCreate = type === 'create';
  
  // Category mapping
  const expenseCategories = [
    { id: 'rent', name: 'Rent Expense', accountCode: '6100', accountName: 'Rent Expense' },
    { id: 'utilities', name: 'Utilities Expense', accountCode: '6200', accountName: 'Utilities Expense' },
    { id: 'marketing', name: 'Marketing & Advertising', accountCode: '6300', accountName: 'Marketing & Advertising' },
    { id: 'professional', name: 'Professional Fees', accountCode: '6400', accountName: 'Professional Fees' },
    { id: 'general', name: 'General & Admin Expense', accountCode: '6500', accountName: 'General & Admin Expense' }
  ];

  // Payment method mapping
  const paymentMethods = [
    { id: 'credit', name: 'Credit', accountCode: '2000', accountName: 'Accounts Payable' },
    { id: 'cash', name: 'Cash', accountCode: '1000', accountName: 'Petty Cash' },
    { id: 'card', name: 'Card', accountCode: '1010', accountName: 'Main Bank Account' },
    { id: 'bank_transfer', name: 'Bank Transfer', accountCode: '1010', accountName: 'Main Bank Account' }
  ];

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    expenseNumber: '',
    vendor: '',
    vendorContact: '',
    vendorPhone: '',
    notes: '',
    currency: 'AED',
    category: '',
    paymentMethod: '',
    amount: '',
    vatAmount: '',
    totalAmount: '',
    accountingEntries: []
  });

  const [currencies] = useState(['AED', 'USD', 'EUR', 'GBP', 'CAD']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (expense && !isCreate) {
      setFormData({
        ...expense,
        date: expense.date ? expense.date.split('T')[0] : new Date().toISOString().split('T')[0],
        accountingEntries: expense.accountingEntries || []
      });
    } else if (isCreate) {
      setFormData(prev => ({
        ...prev,
        expenseNumber: Math.floor(1000 + Math.random() * 9000).toString()
      }));
    }
  }, [expense, isCreate]);

  // Update accounting entries when category, payment method, or amount changes
  useEffect(() => {
    if (formData.category && formData.paymentMethod && formData.amount) {
      updateAccountingEntries();
    }
  }, [formData.category, formData.paymentMethod, formData.amount, formData.vatAmount]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateAccountingEntries = () => {
    const amount = parseFloat(formData.amount) || 0;
    const vatAmount = parseFloat(formData.vatAmount) || 0;
    const totalAmount = amount + vatAmount;

    // Get selected category and payment method
    const selectedCategory = expenseCategories.find(cat => cat.id === formData.category);
    const selectedPayment = paymentMethods.find(pay => pay.id === formData.paymentMethod);

    if (!selectedCategory || !selectedPayment) return;

    const entries = [];

    // Entry for the expense category (Debit)
    entries.push({
      account: selectedCategory.accountCode,
      accountName: selectedCategory.accountName,
      debit: amount.toFixed(2),
      credit: '',
      description: `Record ${selectedCategory.name}`
    });

    // Entry for VAT (if applicable)
    if (vatAmount > 0) {
      entries.push({
        account: '2010', // Output VAT Receivable account
        accountName: 'Output VAT Receivable',
        debit: vatAmount.toFixed(2),
        credit: '',
        description: 'Record VAT receivable'
      });
    }

    // Entry for payment method (Credit)
    entries.push({
      account: selectedPayment.accountCode,
      accountName: selectedPayment.accountName,
      debit: '',
      credit: totalAmount.toFixed(2),
      description: `Record ${selectedPayment.name}`
    });

    setFormData(prev => ({
      ...prev,
      totalAmount: totalAmount.toFixed(2),
      accountingEntries: entries
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.category) {
      alert('Please select an expense category.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.paymentMethod) {
      alert('Please select a payment method.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount.');
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

  const calculateTotals = () => {
    const entries = formData.accountingEntries || [];
    const totalDebits = entries.reduce((sum, entry) => sum + parseFloat(entry.debit || 0), 0);
    const totalCredits = entries.reduce((sum, entry) => sum + parseFloat(entry.credit || 0), 0);
    const difference = totalDebits - totalCredits;
    
    return {
      totalDebits,
      totalCredits,
      difference,
      isBalanced: Math.abs(difference) < 0.01
    };
  };

  const totals = calculateTotals();

  // Safe expense data for view mode
  const safeExpense = expense || {};
  const safeAccountingEntries = safeExpense.accountingEntries || [];

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content expense-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">
              {isView ? 'View Expense' : isCreate ? 'Add Expenses Input' : 'Edit Expense'}
            </h2>
            <p className="modal-subtitle">
              {isView ? 'Expense details' : 'Fill the required details'}
            </p>
          </div>

          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="modal-body">
          {isView ? (
            // View Mode
            <div className="expense-details-view">

            <div className="modal-form-section">
                <h4>Expanse Information</h4>
              <div className="expense-detail-grid">
                <div className="expense-detail-item">
                  <label>Expense Number</label>
                  <div className="expense-detail-value">
                    <span className="expense-number-display">EXP-{safeExpense.expenseNumber || 'N/A'}</span>
                  </div>
                </div>
                <div className="expense-detail-item">
                  <label>Date</label>
                  <div className="expense-detail-value">
                    {safeExpense.date ? new Date(safeExpense.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'N/A'}
                  </div>
                </div>
                <div className="expense-detail-item">
                  <label>Currency</label>
                  <div className="expense-detail-value">
                    <span className="expense-currency-display">{safeExpense.currency || 'AED'}</span>
                  </div>
                </div>
                <div className="expense-detail-item">
                  <label>Status</label>
                  <div className="expense-detail-value">
                    <span className={`expense-status-badge expense-status-${(safeExpense.status || 'draft').toLowerCase()}`}>
                      {safeExpense.status || 'Draft'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

              <div className="modal-form-section">
                <h4>Expense Details</h4>
                <div className="expense-detail-grid">
                  <div className="expense-detail-item">
                    <label>Category</label>
                    <div className="expense-detail-value">
                      {safeExpense.category ? expenseCategories.find(cat => cat.id === safeExpense.category)?.name : 'N/A'}
                    </div>
                  </div>
                  <div className="expense-detail-item">
                    <label>Payment Method</label>
                    <div className="expense-detail-value">
                      {safeExpense.paymentMethod ? paymentMethods.find(pay => pay.id === safeExpense.paymentMethod)?.name : 'N/A'}
                    </div>
                  </div>
                  <div className="expense-detail-item">
                    <label>Amount</label>
                    <div className="expense-detail-value">
                      {safeExpense.amount || '0.00'} {safeExpense.currency || 'AED'}
                    </div>
                  </div>
                  <div className="expense-detail-item">
                    <label>VAT Amount</label>
                    <div className="expense-detail-value">
                      {safeExpense.vatAmount || '0.00'} {safeExpense.currency || 'AED'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-form-section">
                <h4>Vendor Information</h4>
                <div className="expense-detail-grid">
                  <div className="expense-detail-item">
                    <label>Vendor Name</label>
                    <div className="expense-detail-value expense-vendor-display">
                      {safeExpense.vendor || 'N/A'}
                    </div>
                  </div>
                  <div className="expense-detail-item">
                    <label>Contact Email</label>
                    <div className="expense-detail-value">{safeExpense.vendorContact || 'N/A'}</div>
                  </div>
                  <div className="expense-detail-item">
                    <label>Phone</label>
                    <div className="expense-detail-value">{safeExpense.vendorPhone || 'N/A'}</div>
                  </div>
                </div>
              </div>


               <div className="modal-form-section">
                <h4>Notes</h4>
              {safeExpense.notes && (
                <div className="expense-detail-section">
                  <div className="expense-notes-content">
                    {safeExpense.notes}
                  </div>
                </div>
              )}
              </div>
            <div className="modal-form-section">
                              <h4>Accounting Entry (Accrual Basis)</h4>

              <div className="expense-detail-section">
                <div className="expense-entries-table-container">
                  <table className="expense-entries-table">
                    <thead>
                      <tr>
                        <th>Account</th>
                        <th>Description</th>
                        <th className="text-right">Debit ({safeExpense.currency || 'AED'})</th>
                        <th className="text-right">Credit ({safeExpense.currency || 'AED'})</th>
                      </tr>
                    </thead>
                    <tbody>
                      {safeAccountingEntries.length > 0 ? (
                        safeAccountingEntries.map((entry, index) => (
                          <tr key={index} className="expense-entry-row">
                            <td>
                              <div className="expense-account-info">
                                <div className="expense-account-name">
                                  {entry.account} - {entry.accountName}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="expense-entry-description">
                                {entry.description}
                              </div>
                            </td>
                            <td className="text-right">
                              {entry.debit ? (
                                <span className="expense-amount debit">{entry.debit}</span>
                              ) : (
                                <span className="expense-amount zero">-</span>
                              )}
                            </td>
                            <td className="text-right">
                              {entry.credit ? (
                                <span className="expense-amount credit">{entry.credit}</span>
                              ) : (
                                <span className="expense-amount zero">-</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center text-muted">
                            No accounting entries available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              </div>


<div className="modal-form-section">
                              <h4>Total</h4>
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
              </div>
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
                <h4>Expense Details</h4>
                <div className="expense-form-row">
                  <div className="expense-form-group">
                    <label>Category *</label>
                    <select
                      className="expense-form-control"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      required
                    >
                      <option value="">Select Category</option>
                      {expenseCategories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {formData.category && (
                      <div className="account-mapping-info">
                        <small>
                          Maps to: {expenseCategories.find(cat => cat.id === formData.category)?.accountCode} - 
                          {expenseCategories.find(cat => cat.id === formData.category)?.accountName}
                        </small>
                      </div>
                    )}
                  </div>
                  
                  <div className="expense-form-group">
                    <label>Payment Method *</label>
                    <select
                      className="expense-form-control"
                      value={formData.paymentMethod}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      required
                    >
                      <option value="">Select Payment Method</option>
                      {paymentMethods.map(method => (
                        <option key={method.id} value={method.id}>
                          {method.name}
                        </option>
                      ))}
                    </select>
                    {formData.paymentMethod && (
                      <div className="account-mapping-info">
                        <small>
                          Maps to: {paymentMethods.find(pay => pay.id === formData.paymentMethod)?.accountCode} - 
                          {paymentMethods.find(pay => pay.id === formData.paymentMethod)?.accountName}
                        </small>
                      </div>
                    )}
                  </div>
                </div>

                <div className="expense-form-row">
                  <div className="expense-form-group">
                    <label>Amount ({formData.currency}) *</label>
                    <input
                      type="number"
                      className="expense-form-control"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div className="expense-form-group">
                    <label>VAT Amount ({formData.currency})</label>
                    <input
                      type="number"
                      className="expense-form-control"
                      step="0.01"
                      min="0"
                      value={formData.vatAmount}
                      onChange={(e) => handleInputChange('vatAmount', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="expense-form-group">
                    <label>Total Amount ({formData.currency})</label>
                    <input
                      type="text"
                      className="expense-form-control"
                      value={formData.totalAmount || '0.00'}
                      disabled
                    />
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
                      placeholder="+971 123-4567"
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

              {formData.accountingEntries && formData.accountingEntries.length > 0 && (
                <div className="expense-form-section">
                  <h4>Accounting Entry (Accrual Basis)</h4>
                  <div className="expense-entries-table-container">
                    <table className="expense-entries-table">
                      <thead>
                        <tr>
                          <th>Account</th>
                          <th>Description</th>
                          <th className="text-right">Debit ({formData.currency})</th>
                          <th className="text-right">Credit ({formData.currency})</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.accountingEntries.map((entry, index) => (
                          <tr key={index} className="expense-entry-row">
                            <td>
                              <div className="expense-account-info">
                                <div className="expense-account-name">
                                  {entry.account} - {entry.accountName}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="expense-entry-description">
                                {entry.description}
                              </div>
                            </td>
                            <td className="text-right">
                              {entry.debit ? (
                                <span className="expense-amount debit">{entry.debit}</span>
                              ) : (
                                <span className="expense-amount zero">-</span>
                              )}
                            </td>
                            <td className="text-right">
                              {entry.credit ? (
                                <span className="expense-amount credit">{entry.credit}</span>
                              ) : (
                                <span className="expense-amount zero">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                </div>
              )}

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
              disabled={isSubmitting || !totals.isBalanced}
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