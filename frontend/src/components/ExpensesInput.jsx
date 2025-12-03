import React, { useState, useEffect } from 'react';
import ViewEditExpenseModal from '../components/ViewEditExpenseInputModal';
import UniversalTableHeader from '../components/UniversalTableHeader';

const ExpensesInput = () => {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [modalType, setModalType] = useState('view');

  // Enhanced hardcoded sample data
  const sampleExpenses = [
    {
      id: 1,
      expenseNumber: 1001,
      date: '2024-01-15',
      currency: 'AED',
      vendor: 'Office Supplies Co.',
      vendorContact: 'supplies@officeco.com',
      vendorPhone: '+971 123-4567',
      notes: 'Monthly office supplies including printer paper, ink cartridges, and stationery',
      status: 'Posted',
      entries: [
        { 
          account: 'office-supplies', 
          description: 'Printer paper - 10 reams', 
          debit: '150.00', 
          credit: '' 
        },
        { 
          account: 'office-supplies', 
          description: 'Ink cartridges - color', 
          debit: '120.00', 
          credit: '' 
        },
        { 
          account: 'cash', 
          description: 'Payment from petty cash', 
          debit: '', 
          credit: '270.00' 
        }
      ],
      attachments: [
        { name: 'office_supplies_invoice.pdf', size: 245000 },
        { name: 'receipt_011524.jpg', size: 156000 }
      ]
    },
    {
      id: 2,
      expenseNumber: 1002,
      date: '2024-01-18',
      currency: 'AED',
      vendor: 'Tech Equipment Ltd.',
      vendorContact: 'sales@techequipment.com',
      vendorPhone: '+971 987-6543',
      notes: 'Computer peripherals for new hires',
      status: 'Draft',
      entries: [
        { 
          account: 'equipment', 
          description: 'Wireless keyboards - 3 units', 
          debit: '180.00', 
          credit: '' 
        },
        { 
          account: 'equipment', 
          description: 'Optical mice - 3 units', 
          debit: '75.00', 
          credit: '' 
        },
        { 
          account: 'bank', 
          description: 'Bank transfer payment', 
          debit: '', 
          credit: '255.00' 
        }
      ],
      attachments: []
    },
    {
      id: 3,
      expenseNumber: 1003,
      date: '2024-01-22',
      currency: 'AED',
      vendor: 'European Software Solutions',
      vendorContact: 'billing@eusoft.com',
      vendorPhone: '+49 30 12345678',
      notes: 'Annual software license renewal',
      status: 'Posted',
      entries: [
        { 
          account: 'software', 
          description: 'Project management software', 
          debit: '1200.00', 
          credit: '' 
        },
        { 
          account: 'bank-eur', 
          description: 'International wire transfer', 
          debit: '', 
          credit: '1200.00' 
        }
      ],
      attachments: [
        { name: 'software_license_agreement.pdf', size: 320000 },
        { name: 'wire_transfer_confirmation.pdf', size: 280000 }
      ]
    }
  ];

  // Enhanced accounts data
  const accountsData = [
    { id: 'office-supplies', accountCode: '5010', accountName: 'Office Supplies Expense', accountType: 'Expense' },
    { id: 'equipment', accountCode: '5020', accountName: 'Computer Equipment', accountType: 'Asset' },
    { id: 'software', accountCode: '5030', accountName: 'Software Licenses', accountType: 'Expense' },
    { id: 'cash', accountCode: '1010', accountName: 'Petty Cash', accountType: 'Asset' },
    { id: 'bank', accountCode: '1020', accountName: 'Bank Account - Main', accountType: 'Asset' },
    { id: 'bank-eur', accountCode: '1025', accountName: 'Bank Account - EUR', accountType: 'Asset' },
    { id: 'utilities', accountCode: '5040', accountName: 'Utilities Expense', accountType: 'Expense' },
    { id: 'travel', accountCode: '5050', accountName: 'Travel Expense', accountType: 'Expense' }
  ];

  // Define calculateTotals function before it's used
  const calculateTotals = (expense) => {
    const totalDebits = expense.entries.reduce((sum, entry) => sum + parseFloat(entry.debit || 0), 0);
    const totalCredits = expense.entries.reduce((sum, entry) => sum + parseFloat(entry.credit || 0), 0);
    const difference = totalDebits - totalCredits;
    
    return {
      totalDebits,
      totalCredits,
      difference,
      isBalanced: Math.abs(difference) < 0.01
    };
  };

  useEffect(() => {
    setExpenses(sampleExpenses);
  }, []);

  // Calculate expense statistics for the header
  const expenseStats = [
    { value: expenses.length, label: 'Total Expenses' },
    { value: expenses.filter(e => e.status === 'Posted').length, label: 'Posted' },
    { value: expenses.filter(e => e.status === 'Draft').length, label: 'Draft' },
{ 
  value: `AED ${expenses.reduce((sum, expense) => {
    const totals = calculateTotals(expense);
    return sum + totals.totalDebits;
  }, 0).toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`, 
  label: 'Total Amount' 
}
  ];


  const handleAction = (action, expense) => {
    setSelectedExpense(expense);
    setModalType(action);
    setShowModal(true);
  };

  const handleDelete = (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(expenses.filter(expense => expense.id !== expenseId));
      alert('Expense deleted successfully!');
    }
  };

  const handlePostExpense = (expenseId) => {
    setExpenses(expenses.map(expense => 
      expense.id === expenseId ? { ...expense, status: 'Posted' } : expense
    ));
    alert('Expense posted successfully!');
  };

  const handleSaveExpense = (newExpense) => {
    if (modalType === 'create') {
      const nextId = expenses.length ? Math.max(...expenses.map(e => e.id)) + 1 : 1;
      const nextNumber = expenses.length ? Math.max(...expenses.map(e => e.expenseNumber)) + 1 : 1001;
      setExpenses([...expenses, { 
        ...newExpense, 
        id: nextId, 
        expenseNumber: nextNumber,
        status: 'Draft'
      }]);
    } else {
      setExpenses(expenses.map(expense => 
        expense.id === selectedExpense.id ? newExpense : expense
      ));
    }
    setShowModal(false);
    setSelectedExpense(null);
  };

  const handleExport = () => {
    // Export logic here
    console.log('Export expenses clicked');
  };





  return (
    <div className="content-area">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Expense Input</h1>
          <p className="page-subtitle">Manage and track business expenses and vendor payments</p>
        </div>
        <button 
          className="page-header-btn"
          onClick={() => handleAction('create', null)}
        >
          <i className="fas fa-plus"></i>
          Add New Expense
        </button>
      </div>

      <div className="data-table-container expenses-table-container">
        {/* Replaced custom header with UniversalTableHeader */}
        <UniversalTableHeader
          stats={expenseStats}
          onExport={handleExport}
        />

        {/* Search and filter section */}
     

        <table className="data-table expenses-data-table">
          <thead>
            <tr>
              <th>Expense #</th>
              <th>Date</th>
              <th>Vendor</th>
              <th>Currency</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(expense => {
              const totals = calculateTotals(expense);
              
              return (
                <tr key={expense.id} className="expense-row">
                  <td>
                    <div className="expense-number-cell">
                      <span className="expense-number">EXP-{expense.expenseNumber}</span>
                    </div>
                  </td>
                  <td>
                    <div className="expense-date-cell">
                      {new Date(expense.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </td>
                  <td>
                    <div className="expense-vendor-cell">
                      <div className="vendor-name">{expense.vendor}</div>
                      <div className="vendor-contact">{expense.vendorContact}</div>
                    </div>
                  </td>
                  <td>
                    <span className="expense-currency-badge">{expense.currency}</span>
                  </td>
                  <td>
                    <div className="expense-amount-cell expense-debit-amount">
                     AED  {totals.totalDebits.toLocaleString()}
                    </div>
                  </td>
                  <td>
                    <div className="expense-status-cell">
                      <span 
                        className={`expense-status-badge expense-status-${expense.status.toLowerCase()}`}
                      >
                        {expense.status}
                      </span>
                      {!totals.isBalanced && (
                        <span className="expense-unbalanced-warning" title="Expense is not balanced">
                          <i className="fas fa-exclamation-triangle"></i>
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="expense-notes-cell">
                      {expense.notes}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn view" 
                        onClick={() => handleAction('view', expense)}
                        title="View Expense"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button 
                        className="action-btn edit" 
                        onClick={() => handleAction('edit', expense)}
                        title="Edit Expense"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      {expense.status === 'Draft' && (
                        <button 
                          className="action-btn post" 
                          onClick={() => handlePostExpense(expense.id)}
                          title="Post Expense"
                        >
                          <i className="fas fa-check"></i>
                        </button>
                      )}
                      <button 
                        className="action-btn delete" 
                        onClick={() => handleDelete(expense.id)}
                        title="Delete Expense"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {expenses.length === 0 && (
          <div className="empty-state expenses-empty-state">
            <div className="empty-icon expenses-empty-icon">
              <i className="fas fa-receipt"></i>
            </div>
            <h3>No Expenses Found</h3>
            <p>Start tracking your business expenses by creating your first expense entry</p>
            <button 
              className="btn btn-primary with-icon"
              onClick={() => handleAction('create', null)}
            >
              <i className="fas fa-plus"></i>
              Add New Expense
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <ViewEditExpenseModal 
          expense={selectedExpense}
          type={modalType}
          onClose={() => {
            setShowModal(false);
            setSelectedExpense(null);
          }}
          onSave={handleSaveExpense}
          accounts={accountsData}
        />
      )}
    </div>
  );
};

export default ExpensesInput;