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

  // Helper function to format numbers with commas
  const formatNumber = (value) => {
    if (value === '' || value === null || value === undefined) return '';
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    return num.toLocaleString();
  };

  // Function to format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    // Check if already in DD/MM/YYYY format
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      return dateString;
    }
    
    // Try to parse various date formats
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString || 'N/A';
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

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
  if (field === 'amount' || field === 'vatAmount') {
    // Clean the input for amount fields
    let cleanedValue = value;
    
    // Remove any non-numeric characters except decimal point
    cleanedValue = cleanedValue.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const decimalCount = cleanedValue.split('.').length - 1;
    if (decimalCount > 1) {
      cleanedValue = cleanedValue.substring(0, cleanedValue.lastIndexOf('.'));
    }
    
    // Limit to 2 decimal places
    if (cleanedValue.includes('.')) {
      const parts = cleanedValue.split('.');
      if (parts[1].length > 2) {
        cleanedValue = parts[0] + '.' + parts[1].substring(0, 2);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: cleanedValue
    }));
    
    // Recalculate VAT and totals when amount changes
    if (field === 'amount' && cleanedValue) {
      const amount = parseFloat(cleanedValue) || 0;
      const vatAmount = amount * 0.05; // 5% VAT
      const totalAmount = amount + vatAmount;
      
      setFormData(prev => ({
        ...prev,
        vatAmount: vatAmount.toFixed(2),
        totalAmount: totalAmount.toFixed(2)
      }));
    }
  } else if (field === 'date') {
    // Store date as entered
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  } else {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }
};

  const updateAccountingEntries = () => {
  const amount = parseFloat(formData.amount) || 0;
  // Calculate 5% VAT automatically
  const vatAmount = amount * 0.05; // 5% VAT
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
    debit: formatNumber(amount),
    credit: '',
    description: `Record ${selectedCategory.name}`
  });

  // Entry for VAT (if applicable)
  if (vatAmount > 0) {
    entries.push({
      account: '2010', // Output VAT Receivable account
      accountName: 'Output VAT Receivable',
      debit: formatNumber(vatAmount),
      credit: '',
      description: 'Record VAT receivable (5%)'
    });
  }

  // Entry for payment method (Credit)
  entries.push({
    account: selectedPayment.accountCode,
    accountName: selectedPayment.accountName,
    debit: '',
    credit: formatNumber(totalAmount),
    description: `Record ${selectedPayment.name}`
  });

  setFormData(prev => ({
    ...prev,
    vatAmount: vatAmount.toFixed(2),
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
    const totalDebits = entries.reduce((sum, entry) => sum + parseFloat(entry.debit.replace(/,/g, '') || 0), 0);
    const totalCredits = entries.reduce((sum, entry) => sum + parseFloat(entry.credit.replace(/,/g, '') || 0), 0);
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
      <div className="modal-content expense-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1000px' }}>
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
        
        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {isView ? (
            // View Mode
            <div className="expense-details-view">
              <div className="modal-form-section">
                <h4>Expense Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expense Number</label>
                    <div className="detail-value" style={{ 
                      textAlign: 'left', 
                      direction: 'ltr',
                      fontFamily: "'Courier New', monospace",
                      fontWeight: '600',
                      color: 'var(--blue-2)'
                    }}>
                      EXP-{safeExpense.expenseNumber || 'N/A'}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>
                      {formatDate(safeExpense.date)}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Currency</label>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>
                      <span style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontWeight: '600',
                        fontSize: '12px'
                      }}>
                        {safeExpense.currency || 'AED'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-form-section">
                <h4>Expense Details</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>
                      {safeExpense.category ? expenseCategories.find(cat => cat.id === safeExpense.category)?.name : 'N/A'}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Payment Method</label>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>
                      {safeExpense.paymentMethod ? paymentMethods.find(pay => pay.id === safeExpense.paymentMethod)?.name : 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Amount</label>
                    <div className="detail-value" style={{ 
                      textAlign: 'left', 
                      direction: 'ltr',
                      fontFamily: "'Courier New', monospace",
                      fontWeight: '600'
                    }}>
                      {formatNumber(safeExpense.amount)} {safeExpense.currency || 'AED'}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>VAT Amount</label>
                    <div className="detail-value" style={{ 
                      textAlign: 'left', 
                      direction: 'ltr',
                      fontFamily: "'Courier New', monospace",
                      fontWeight: '600'
                    }}>
                      {formatNumber(safeExpense.vatAmount)} {safeExpense.currency || 'AED'}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Total Amount</label>
                    <div className="detail-value total" style={{ 
                      textAlign: 'left', 
                      direction: 'ltr',
                      fontFamily: "'Courier New', monospace",
                      fontWeight: '700',
                      color: '#059669'
                    }}>
                      {formatNumber(safeExpense.totalAmount)} {safeExpense.currency || 'AED'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-form-section">
                <h4>Vendor Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Vendor Name</label>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>
                      {safeExpense.vendor || 'N/A'}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Contact Email</label>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>
                      {safeExpense.vendorContact || 'N/A'}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>
                      {safeExpense.vendorPhone || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-form-section">
                <h4>Notes</h4>
                <div className="form-group full-width">
                  <div className="detail-value notes-value" style={{ textAlign: 'left', direction: 'ltr' }}>
                    {safeExpense.notes || 'No notes available'}
                  </div>
                </div>
              </div>

              <div className="modal-form-section">
                <h4>Accounting Entry (Accrual Basis)</h4>
                <div style={{ overflowX: 'auto' }}>
                  <table className="expense-entries-table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left' }}>Account</th>
                        <th style={{ textAlign: 'left' }}>Description</th>
                        <th style={{ textAlign: 'right' }}>Debit ({safeExpense.currency || 'AED'})</th>
                        <th style={{ textAlign: 'right' }}>Credit ({safeExpense.currency || 'AED'})</th>
                      </tr>
                    </thead>
                    <tbody>
                      {safeAccountingEntries.length > 0 ? (
                        safeAccountingEntries.map((entry, index) => (
                          <tr key={index} className="expense-entry-row">
                            <td style={{ textAlign: 'left' }}>
                              <div className="expense-account-info">
                                <div className="expense-account-name">
                                  {entry.account} - {entry.accountName}
                                </div>
                              </div>
                            </td>
                            <td style={{ textAlign: 'left' }}>
                              <div className="expense-entry-description">
                                {entry.description}
                              </div>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {entry.debit ? (
                                <span className="expense-amount debit" style={{ 
                                  fontFamily: "'Courier New', monospace",
                                  fontWeight: '600'
                                }}>{entry.debit}</span>
                              ) : (
                                <span className="expense-amount zero">-</span>
                              )}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {entry.credit ? (
                                <span className="expense-amount credit" style={{ 
                                  fontFamily: "'Courier New', monospace",
                                  fontWeight: '600'
                                }}>{entry.credit}</span>
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

              <div className="modal-form-section">
                <h4>Totals</h4>
                <div className="totals-section" style={{ 
                  background: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  padding: '24px'
                }}>
                  <div className="total-row" style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    fontSize: '15px'
                  }}>
                    <span style={{ fontWeight: '600' }}>Total Debits:</span>
                    <span style={{ 
                      fontFamily: "'Courier New', monospace",
                      fontWeight: '600'
                    }}>
                      {formatNumber(totals.totalDebits)}
                    </span>
                  </div>
                  <div className="total-row" style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    fontSize: '15px'
                  }}>
                    <span style={{ fontWeight: '600' }}>Total Credits:</span>
                    <span style={{ 
                      fontFamily: "'Courier New', monospace",
                      fontWeight: '600'
                    }}>
                      {formatNumber(totals.totalCredits)}
                    </span>
                  </div>
                  <div className="total-row" style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    fontSize: '15px'
                  }}>
                    <span style={{ fontWeight: '600' }}>Difference:</span>
                    <span style={{ 
                      fontFamily: "'Courier New', monospace",
                      fontWeight: '700',
                      color: totals.difference === 0 ? '#2e7d32' : '#d32f2f'
                    }}>
                      {formatNumber(totals.difference)}
                    </span>
                  </div>
                  <div className="total-row final" style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '2px solid #e5e7eb',
                    fontSize: '16px',
                    fontWeight: '700'
                  }}>
                    <span>Status:</span>
                    <span style={{ 
                      color: totals.isBalanced ? '#2e7d32' : '#d32f2f',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      background: totals.isBalanced ? '#e8f5e9' : '#ffebee',
                      fontSize: '12px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {totals.isBalanced ? '✓ BALANCED' : '✗ UNBALANCED'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Edit/Create Mode
            <form onSubmit={handleSubmit} className="expense-form">
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
                      style={{ textAlign: 'left', direction: 'ltr' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Expense Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={`EXP-${formData.expenseNumber}`}
                      disabled
                      style={{ 
                        textAlign: 'left', 
                        direction: 'ltr',
                        fontFamily: "'Courier New', monospace",
                        fontWeight: '600'
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Currency *</label>
                    <select
                      className="form-control"
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      required
                      style={{ textAlign: 'left', direction: 'ltr' }}
                    >
                      {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-form-section">
                <h4>Expense Details</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      className="form-control"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      required
                      style={{ textAlign: 'left', direction: 'ltr' }}
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
                  
                  <div className="form-group">
                    <label>Payment Method *</label>
                    <select
                      className="form-control"
                      value={formData.paymentMethod}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      required
                      style={{ textAlign: 'left', direction: 'ltr' }}
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

                <div className="form-row">
                  <div className="form-group">
                    <label>Amount ({formData.currency}) *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        className="form-control"
                        value={formatNumber(formData.amount)}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        onFocus={(e) => {
                          e.target.value = formData.amount || '';
                        }}
                        onBlur={(e) => {
                          if (e.target.value) {
                            const num = parseFloat(e.target.value);
                            if (!isNaN(num)) {
                              e.target.value = formatNumber(num);
                            }
                          }
                        }}
                        placeholder="0.00"
                        required
                        style={{ 
                          textAlign: 'left', 
                          direction: 'ltr',
                          fontFamily: "'Courier New', monospace", 
                          fontWeight: '600',
                          paddingRight: '40px'
                        }}
                      />
                      <span style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#6b7280',
                        fontSize: '12px',
                        pointerEvents: 'none'
                      }}>
                        {formData.currency}
                      </span>
                    </div>
                  </div>
                  
                  <div className="form-group">
  <label>VAT Amount ({formData.currency})</label>
  <div style={{ position: 'relative' }}>
    <input
      type="text"
      className="form-control"
      value={formatNumber(formData.vatAmount) || formatNumber(0)}
      disabled
      style={{ 
        textAlign: 'left', 
        direction: 'ltr',
        fontFamily: "'Courier New', monospace", 
        fontWeight: '600',
        paddingRight: '40px',
        backgroundColor: '#f0f9ff',
        borderColor: '#bae6fd'
      }}
    />
    <span style={{
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#0284c7',
      fontSize: '12px',
      pointerEvents: 'none',
      fontWeight: '600'
    }}>
      {formData.currency}
    </span>
  </div>
  <div className="calculation-info" style={{
    fontSize: '11px',
    color: '#0284c7',
    marginTop: '4px',
    fontStyle: 'italic'
  }}>
    Calculated as 5% of amount
  </div>
</div>
                  
<div className="form-group">
  <label>Total Amount ({formData.currency})</label>
  <input
    type="text"
    className="form-control"
    value={formatNumber(formData.totalAmount) || formatNumber(0)}
    disabled
    style={{ 
      textAlign: 'left', 
      direction: 'ltr',
      fontFamily: "'Courier New', monospace",
      fontWeight: '700',
      color: '#059669',
      backgroundColor: '#f0fdf4',
      borderColor: '#86efac'
    }}
  />
  <div className="calculation-info" style={{
    fontSize: '11px',
    color: '#059669',
    marginTop: '4px',
    fontStyle: 'italic'
  }}>
    Amount + 5% VAT
  </div>
</div>
                </div>
              </div>

              <div className="modal-form-section">
                <h4>Vendor Details</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Vendor Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.vendor}
                      onChange={(e) => handleInputChange('vendor', e.target.value)}
                      placeholder="Enter vendor name"
                      required
                      style={{ textAlign: 'left', direction: 'ltr' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.vendorContact}
                      onChange={(e) => handleInputChange('vendorContact', e.target.value)}
                      placeholder="vendor@company.com"
                      style={{ textAlign: 'left', direction: 'ltr' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.vendorPhone}
                      onChange={(e) => handleInputChange('vendorPhone', e.target.value)}
                      placeholder="+971 123-4567"
                      style={{ textAlign: 'left', direction: 'ltr' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Enter expense description or notes..."
                    style={{ textAlign: 'left', direction: 'ltr' }}
                  />
                </div>
              </div>

              {formData.accountingEntries && formData.accountingEntries.length > 0 && (
                <div className="modal-form-section">
                  <h4>Accounting Entry (Accrual Basis)</h4>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="expense-entries-table" style={{ width: '100%' }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left' }}>Account</th>
                          <th style={{ textAlign: 'left' }}>Description</th>
                          <th style={{ textAlign: 'right' }}>Debit ({formData.currency})</th>
                          <th style={{ textAlign: 'right' }}>Credit ({formData.currency})</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.accountingEntries.map((entry, index) => (
                          <tr key={index} className="expense-entry-row">
                            <td style={{ textAlign: 'left' }}>
                              <div className="expense-account-info">
                                <div className="expense-account-name">
                                  {entry.account} - {entry.accountName}
                                </div>
                              </div>
                            </td>
                            <td style={{ textAlign: 'left' }}>
                              <div className="expense-entry-description">
                                {entry.description}
                              </div>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {entry.debit ? (
                                <span className="expense-amount debit" style={{ 
                                  fontFamily: "'Courier New', monospace",
                                  fontWeight: '600'
                                }}>{entry.debit}</span>
                              ) : (
                                <span className="expense-amount zero">-</span>
                              )}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {entry.credit ? (
                                <span className="expense-amount credit" style={{ 
                                  fontFamily: "'Courier New', monospace",
                                  fontWeight: '600'
                                }}>{entry.credit}</span>
                              ) : (
                                <span className="expense-amount zero">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="totals-section" style={{ 
                    background: '#f8f9fa',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    padding: '24px',
                    marginTop: '20px'
                  }}>
                    <div className="total-row" style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      fontSize: '15px'
                    }}>
                      <span style={{ fontWeight: '600' }}>Total Debits:</span>
                      <span style={{ 
                        fontFamily: "'Courier New', monospace",
                        fontWeight: '600'
                      }}>
                        {formatNumber(totals.totalDebits)}
                      </span>
                    </div>
                    <div className="total-row" style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      fontSize: '15px'
                    }}>
                      <span style={{ fontWeight: '600' }}>Total Credits:</span>
                      <span style={{ 
                        fontFamily: "'Courier New', monospace",
                        fontWeight: '600'
                      }}>
                        {formatNumber(totals.totalCredits)}
                      </span>
                    </div>
                    <div className="total-row" style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      fontSize: '15px'
                    }}>
                      <span style={{ fontWeight: '600' }}>Difference:</span>
                      <span style={{ 
                        fontFamily: "'Courier New', monospace",
                        fontWeight: '700',
                        color: totals.difference === 0 ? '#2e7d32' : '#d32f2f'
                      }}>
                        {formatNumber(totals.difference)}
                      </span>
                    </div>
                    <div className="total-row final" style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      paddingTop: '16px',
                      borderTop: '2px solid #e5e7eb',
                      fontSize: '16px',
                      fontWeight: '700'
                    }}>
                      <span>Status:</span>
                      <span style={{ 
                        color: totals.isBalanced ? '#2e7d32' : '#d32f2f',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        background: totals.isBalanced ? '#e8f5e9' : '#ffebee',
                        fontSize: '12px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>
                        {totals.isBalanced ? '✓ BALANCED' : '✗ UNBALANCED'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
        
        <div className="modal-footer" style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '16px', 
          padding: '20px 28px',
          background: '#f8fafc',
          borderTop: '1px solid #e9ecef',
          borderRadius: '0 0 16px 16px'
        }}>
          <button 
            className="btn btn-outline" 
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              background: 'transparent',
              border: '2px solid #9ca3af',
              color: '#6b7280',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              minWidth: '120px',
              textAlign: 'center'
            }}
          >
            {isView ? 'Close' : 'Cancel'}
          </button>
          {!isView && (
            <button 
              className="btn btn-primary with-icon" 
              onClick={handleSubmit}
              disabled={isSubmitting || !totals.isBalanced}
              style={{
                background: totals.isBalanced ? 'linear-gradient(135deg, var(--blue-2), var(--blue-1))' : '#9ca3af',
                border: 'none',
                color: 'white',
                padding: '12px 28px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: totals.isBalanced ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                minWidth: '160px',
                textAlign: 'center'
              }}
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