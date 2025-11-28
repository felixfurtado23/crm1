import React, { useState, useEffect } from 'react';
import ViewPDFInvoiceModal from './ViewPDFInvoiceModal';
import AddPDFInvoiceModal from './AddPDFInvoiceModal'; // Add this import

const PDFInvoiceTable = () => {
  const [invoices, setInvoices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); // Add this state
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [modalType, setModalType] = useState('view');

  // Hardcoded sample data for PDF invoices
  const sampleInvoices = [
    {
      id: 1,
      invoiceNumber: 'INV-001',
      vendor: 'ABC Supplies Co.',
      date: '2024-01-15',
      dueDate: '2024-02-14',
      amount: 1500.00,
      vatAmount: 75.00,
      totalAmount: 1575.00,
      status: 'Pending',
      pdfFile: 'invoice_001.pdf',
      items: [
        { description: 'Office Supplies', quantity: 1, unitPrice: 1500.00, amount: 1500.00 }
      ],
      journalEntries: [
        { account: 'Accounts Payable', debit: 0, credit: 1575.00, description: 'Record purchase from vendor' },
        { account: 'Inventory', debit: 1500.00, credit: 0, description: 'Record purchase of inventory' },
        { account: 'VAT Recoverable', debit: 75.00, credit: 0, description: 'Record VAT receivable' }
      ]
    },
    {
      id: 2,
      invoiceNumber: 'INV-002',
      vendor: 'Tech Solutions Ltd.',
      date: '2024-01-20',
      dueDate: '2024-02-19',
      amount: 8000.00,
      vatAmount: 400.00,
      totalAmount: 8400.00,
      status: 'Paid',
      pdfFile: 'invoice_002.pdf',
      items: [
        { description: 'Laptop Computers', quantity: 4, unitPrice: 2000.00, amount: 8000.00 }
      ],
      journalEntries: [
        { account: 'Accounts Payable', debit: 0, credit: 8400.00, description: 'Record purchase from vendor' },
        { account: 'Fixed Assets', debit: 8000.00, credit: 0, description: 'Record purchase of equipment' },
        { account: 'VAT Recoverable', debit: 400.00, credit: 0, description: 'Record VAT receivable' }
      ]
    },
    {
      id: 3,
      invoiceNumber: 'INV-003',
      vendor: 'Office Furniture Inc.',
      date: '2024-01-25',
      dueDate: '2024-02-24',
      amount: 3000.00,
      vatAmount: 150.00,
      totalAmount: 3150.00,
      status: 'Pending',
      pdfFile: 'invoice_003.pdf',
      items: [
        { description: 'Office Chairs', quantity: 10, unitPrice: 300.00, amount: 3000.00 }
      ],
      journalEntries: [
        { account: 'Accounts Payable', debit: 0, credit: 3150.00, description: 'Record purchase from vendor' },
        { account: 'Furniture & Fixtures', debit: 3000.00, credit: 0, description: 'Record purchase of furniture' },
        { account: 'VAT Recoverable', debit: 150.00, credit: 0, description: 'Record VAT receivable' }
      ]
    }
  ];

  useEffect(() => {
    setInvoices(sampleInvoices);
  }, []);

  const handleAction = (action, invoice) => {
    setSelectedInvoice(invoice);
    setModalType(action);
    setShowModal(true);
  };

  

  const handleMarkAsPaid = (invoiceId) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === invoiceId ? { ...invoice, status: 'Paid' } : invoice
    ));
    alert('Invoice marked as paid!');
  };

  const handleDelete = (invoiceId) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(invoices.filter(invoice => invoice.id !== invoiceId));
      alert('Invoice deleted successfully!');
    }
  };



  return (
    <div className="content-area">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">PDF Invoice Processing</h1>
          <p className="page-subtitle">Upload PDF invoices and automatically process them into the system</p>
        </div>
        {/* NEW UPLOAD BUTTON */}
        <button 
          className="page-header-btn"
          onClick={() => setShowAddModal(true)}
        >
          <i className="fas fa-file-pdf"></i>
          Upload PDF Invoice
        </button>
      </div>

      
<div className="data-table-container">
  <div className="universal-table-header">
    <div className="universal-stats">
      <div className="table-stat-item">
        <strong>{invoices.length}</strong>
        <span>Total Invoices</span>
      </div>
      <div className="table-stat-item">
        <strong>{invoices.filter(inv => inv.status === 'Pending').length}</strong>
        <span>Pending</span>
      </div>
      <div className="table-stat-item">
        <strong>{invoices.filter(inv => inv.status === 'Paid').length}</strong>
        <span>Paid</span>
      </div>
    </div>
    <div className="universal-table-actions">
      <button className="export-btn">
        <i className="fas fa-download"></i>
        Export
      </button>
    </div>
  </div>

  <table className="data-table">
    <thead>
      <tr>
        <th>Invoice Number</th>
        <th>Vendor</th>
        <th>Date</th>
        <th>Due Date</th>
        <th>Amount (AED)</th>
        <th>VAT (AED)</th>
        <th>Total (AED)</th>
        <th>Status</th>
        <th>PDF File</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {invoices.map(invoice => (
        <tr key={invoice.id} className="expense-row">
          <td>
            <span className="lead-id">{invoice.invoiceNumber}</span>
          </td>
          <td>
            <div className="expense-vendor-cell">
              <div className="vendor-name">{invoice.vendor}</div>
            </div>
          </td>
          <td className="expense-date-cell">
            {new Date(invoice.date).toLocaleDateString()}
          </td>
          <td className="expense-date-cell">
            {new Date(invoice.dueDate).toLocaleDateString()}
          </td>
          <td className="expense-amount-cell">
            <strong className="expense-debit-amount">AED {Number(invoice.amount).toLocaleString()}</strong>
          </td>
          <td className="expense-amount-cell">
            <span className="expense-debit-amount">AED {Number(invoice.vatAmount).toLocaleString()}</span>
          </td>
          <td className="expense-amount-cell">
            <strong className="total-amount expense-debit-amount">AED {Number(invoice.totalAmount).toLocaleString()}</strong>
          </td>
          <td>
            <div className="expense-status-cell">
              <span 
                className={`expense-status-badge ${
                  invoice.status === 'Paid' ? 'expense-status-posted' : 
                  invoice.status === 'Pending' ? 'expense-status-pending' : 
                  'expense-status-draft'
                }`}
              >
                {invoice.status}
              </span>
            </div>
          </td>
          <td>
            <div className="file-attachment">
              <i className="fas fa-file-pdf pdf-color"></i>
              <span>{invoice.pdfFile}</span>
            </div>
          </td>
          <td>
            <div className="action-buttons">
              <button 
                className="action-btn view" 
                onClick={() => handleAction('view', invoice)}
              >
                <i className="fas fa-eye"></i> 
              </button>
              {invoice.status === 'Pending' && (
                <button 
                  className="action-btn convert" 
                  onClick={() => handleMarkAsPaid(invoice.id)}
                >
                  <i className="fas fa-check"></i> 
                </button>
              )}
              <button 
                className="action-btn delete" 
                onClick={() => handleDelete(invoice.id)}
              >
                <i className="fas fa-trash"></i> 
                </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {invoices.length === 0 && (
    <div className="expenses-empty-state">
      <i className="fas fa-file-pdf fa-3x expenses-empty-icon"></i>
      <h3>No PDF Invoices Processed</h3>
      <p>Upload your first PDF invoice to get started</p>
      <button 
        className="btn"
        onClick={() => setShowAddModal(true)}
      >
        <i className="fas fa-file-pdf"></i>
        Upload PDF Invoice
      </button>
    </div>
  )}
</div>

      {/* View/Edit Modal */}
      {showModal && selectedInvoice && (
        <ViewPDFInvoiceModal 
          invoice={selectedInvoice}
          type={modalType}
          onClose={() => {
            setShowModal(false);
            setSelectedInvoice(null);
          }}
          onMarkAsPaid={handleMarkAsPaid}
        />
      )}

      {/* Add PDF Invoice Modal */}
      {showAddModal && (
        <AddPDFInvoiceModal 
          onClose={() => setShowAddModal(false)}
          onSave={(newInvoice) => {
            setInvoices([newInvoice, ...invoices]);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};

export default PDFInvoiceTable;