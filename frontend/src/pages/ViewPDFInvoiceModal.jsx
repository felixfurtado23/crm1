import React, { useState } from 'react';

const ViewPDFInvoiceModal = ({ invoice, type, onClose, onMarkAsPaid }) => {
  const [activeTab, setActiveTab] = useState('details');

  const handleSave = () => {
    alert('Invoice updated successfully!');
    onClose();
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-content pdf-invoice-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <h2 className="modal-title">{invoice.invoiceNumber}</h2>
            <p className="modal-subtitle">{invoice.vendor}</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Status Bar */}
        <div className={`status-bar ${invoice.status.toLowerCase()}`}>
          <div className="status-content">
            <i className={`fas ${invoice.status === 'Paid' ? 'fa-check-circle' : 'fa-clock'}`}></i>
            <span>Invoice {invoice.status}</span>
          </div>
          {invoice.status === 'Pending' && (
            <button className="btn-primary" onClick={() => onMarkAsPaid(invoice.id)}>
              Mark as Paid
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <i className="fas fa-receipt"></i>
            Details
          </button>
          <button 
            className={`tab-btn ${activeTab === 'accounting' ? 'active' : ''}`}
            onClick={() => setActiveTab('accounting')}
          >
            <i className="fas fa-calculator"></i>
            Accounting
          </button>
          <button 
            className={`tab-btn ${activeTab === 'document' ? 'active' : ''}`}
            onClick={() => setActiveTab('document')}
          >
            <i className="fas fa-file-pdf"></i>
            Document
          </button>
        </div>

        {/* Content */}
        <div className="modal-body">
          {activeTab === 'details' && (
            <div className="tab-content">
              <div className="content-section">
                <h3 className="section-title">Invoice Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Invoice Number</label>
                    <div className="info-value">{invoice.invoiceNumber}</div>
                  </div>
                  <div className="info-item">
                    <label>Vendor</label>
                    <div className="info-value">{invoice.vendor}</div>
                  </div>
                  <div className="info-item">
                    <label>Invoice Date</label>
                    <div className="info-value">{new Date(invoice.date).toLocaleDateString()}</div>
                  </div>
                  <div className="info-item">
                    <label>Due Date</label>
                    <div className="info-value">{new Date(invoice.dueDate).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              <div className="content-section">
                <h3 className="section-title">Amount Summary</h3>
                <div className="amount-card">
                  <div className="amount-row">
                    <span>Subtotal</span>
                    <span>{invoice.amount.toFixed(2)} AED</span>
                  </div>
                  <div className="amount-row">
                    <span>VAT (5%)</span>
                    <span>{invoice.vatAmount.toFixed(2)} AED</span>
                  </div>
                  <div className="amount-row total">
                    <span>Total Amount</span>
                    <span>{invoice.totalAmount.toFixed(2)} AED</span>
                  </div>
                </div>
              </div>

              <div className="content-section">
                <h3 className="section-title">Line Items</h3>
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.description}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-right">{item.unitPrice.toFixed(2)}</td>
                          <td className="text-right">{item.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'accounting' && (
            <div className="tab-content">
              <div className="content-section">
                <h3 className="section-title">Accounting Entries</h3>
                <p className="section-description">Automated journal entries from invoice processing</p>
                
                <div className="table-wrapper">
                  <table className="accounting-table">
                    <thead>
                      <tr>
                        <th>Account</th>
                        <th className="text-right">Debit (AED)</th>
                        <th className="text-right">Credit (AED)</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.journalEntries.map((entry, index) => (
                        <tr key={index}>
                          <td>
                            <div className="account-name">
                              <i className="fas fa-book"></i>
                              {entry.account}
                            </div>
                          </td>
                          <td className="text-right">
                            {entry.debit > 0 ? (
                              <span className="debit">{entry.debit.toFixed(2)}</span>
                            ) : '-'}
                          </td>
                          <td className="text-right">
                            {entry.credit > 0 ? (
                              <span className="credit">{entry.credit.toFixed(2)}</span>
                            ) : '-'}
                          </td>
                          <td className="description">{entry.description}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="table-footer">
                        <td><strong>Total</strong></td>
                        <td className="text-right">
                          <strong className="debit">
                            {invoice.journalEntries.reduce((sum, entry) => sum + entry.debit, 0).toFixed(2)}
                          </strong>
                        </td>
                        <td className="text-right">
                          <strong className="credit">
                            {invoice.journalEntries.reduce((sum, entry) => sum + entry.credit, 0).toFixed(2)}
                          </strong>
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'document' && (
            <div className="tab-content">
              <div className="content-section">
                <h3 className="section-title">Document</h3>
                <div className="document-card">
                  <div className="document-preview">
                    <i className="fas fa-file-pdf"></i>
                    <h4>PDF Document</h4>
                    <p>{invoice.pdfFile}</p>
                  </div>
                  <div className="document-actions">
                    <button className="btn-outline">
                      <i className="fas fa-eye"></i>
                      Preview
                    </button>
                    <button className="btn-primary">
                      <i className="fas fa-download"></i>
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-outline" onClick={onClose}>
            Close
          </button>
          {type === 'edit' && (
            <button className="btn-primary" onClick={handleSave}>
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPDFInvoiceModal;