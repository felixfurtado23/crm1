import React, { useState } from 'react';

const ViewPDFInvoiceModal = ({ invoice, type, onClose, onMarkAsPaid }) => {
  const [activeTab, setActiveTab] = useState('details');

  const handleSave = () => {
    // Handle save logic here
    alert('Invoice updated successfully!');
    onClose();
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-content pdf-invoice-modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {invoice.invoiceNumber} - {invoice.vendor}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

    

        <div className="modal-body">
          {/* Status Banner */}
          <div className={`status-banner ${invoice.status.toLowerCase()}`}>
            <div className="status-content">
              <i className={`fas ${invoice.status === 'Paid' ? 'fa-check-circle' : 'fa-clock'}`}></i>
              <div>
                <h4>Invoice {invoice.status}</h4>
                <p>
                  {invoice.status === 'Paid' 
                    ? 'This invoice has been paid and processed.' 
                    : 'This invoice is pending payment.'}
                </p>
              </div>
            </div>
            {invoice.status === 'Pending' && (
              <button 
                className="btn mark-paid-btn"
                onClick={() => onMarkAsPaid(invoice.id)}
              >
                <i className="fas fa-check"></i>
                Mark as Paid
              </button>
            )}
          </div>

          {/* Invoice Details Tab */}
          {activeTab === 'details' && (
            <div className="tab-content">
              <div className="details-grid">
                <div className="detail-section">
                  <h3 className="section-title">Basic Information</h3>
                  <div className="detail-row">
                    <div className="detail-item">
                      <label>Invoice Number</label>
                      <div className="detail-value">{invoice.invoiceNumber}</div>
                    </div>
                    <div className="detail-item">
                      <label>Vendor</label>
                      <div className="detail-value">{invoice.vendor}</div>
                    </div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-item">
                      <label>Invoice Date</label>
                      <div className="detail-value">{new Date(invoice.date).toLocaleDateString()}</div>
                    </div>
                    <div className="detail-item">
                      <label>Due Date</label>
                      <div className="detail-value">{new Date(invoice.dueDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-item">
                      <label>PDF File</label>
                      <div className="detail-value">
                        <div className="file-display">
                          <i className="fas fa-file-pdf pdf-icon"></i>
                          <span>{invoice.pdfFile}</span>
                          <button className="download-btn">
                            <i className="fas fa-download"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3 className="section-title">Amount Details</h3>
                  <div className="amount-card">
                    <div className="amount-row">
                      <span>Subtotal</span>
                      <span className="amount">{invoice.amount.toFixed(2)} AED</span>
                    </div>
                    <div className="amount-row">
                      <span>VAT (5%)</span>
                      <span className="amount">{invoice.vatAmount.toFixed(2)} AED</span>
                    </div>
                    <div className="amount-row total">
                      <span>Total Amount</span>
                      <span className="amount">{invoice.totalAmount.toFixed(2)} AED</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="detail-section">
                <h3 className="section-title">Line Items</h3>
                <div className="line-items-table-container">
                  <table className="line-items-table">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Unit Price (AED)</th>
                        <th>Amount (AED)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="item-description">
                              <strong>{item.description}</strong>
                            </div>
                          </td>
                          <td>{item.quantity}</td>
                          <td>{item.unitPrice.toFixed(2)}</td>
                          <td>
                            <strong>{item.amount.toFixed(2)}</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Accounting Entries Tab */}
          {activeTab === 'accounting' && (
            <div className="tab-content">
              <div className="accounting-section">
                <h3 className="section-title">Accounting Entry (Accrual Basis)</h3>
                <p className="section-description">
                  These journal entries are automatically created when the PDF invoice is processed.
                </p>
                
                <div className="accounting-table-container">
                  <table className="accounting-table">
                    <thead>
                      <tr>
                        <th>Account</th>
                        <th>Debit (AED)</th>
                        <th>Credit (AED)</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.journalEntries.map((entry, index) => (
                        <tr key={index} className="accounting-row">
                          <td>
                            <div className="account-name">
                              <i className="fas fa-book"></i>
                              {entry.account}
                            </div>
                          </td>
                          <td>
                            {entry.debit > 0 ? (
                              <span className="debit-amount">{entry.debit.toFixed(2)}</span>
                            ) : '-'}
                          </td>
                          <td>
                            {entry.credit > 0 ? (
                              <span className="credit-amount">{entry.credit.toFixed(2)}</span>
                            ) : '-'}
                          </td>
                          <td>
                            <span className="entry-description">{entry.description}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="accounting-total">
                        <td><strong>Total</strong></td>
                        <td>
                          <strong className="debit-amount">
                            {invoice.journalEntries.reduce((sum, entry) => sum + entry.debit, 0).toFixed(2)}
                          </strong>
                        </td>
                        <td>
                          <strong className="credit-amount">
                            {invoice.journalEntries.reduce((sum, entry) => sum + entry.credit, 0).toFixed(2)}
                          </strong>
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="accounting-summary">
                  <div className="summary-card balanced">
                    <i className="fas fa-balance-scale"></i>
                    <div>
                      <h4>Perfectly Balanced</h4>
                      <p>Debits and credits match perfectly</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PDF Preview Tab */}
          {activeTab === 'pdf' && (
            <div className="tab-content">
              <div className="pdf-preview-section">
                <h3 className="section-title">PDF Preview</h3>
                <div className="pdf-preview">
                  <div className="pdf-placeholder">
                    <i className="fas fa-file-pdf"></i>
                    <h4>PDF Preview</h4>
                    <p>Preview of {invoice.pdfFile}</p>
                    <button className="btn pdf-btn">
                      <i className="fas fa-download"></i>
                      Download Original PDF
                    </button>
                  </div>
                </div>
                <div className="pdf-info">
                  <div className="info-item">
                    <label>File Name</label>
                    <span>{invoice.pdfFile}</span>
                  </div>
                  <div className="info-item">
                    <label>Upload Date</label>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="info-item">
                    <label>File Size</label>
                    <span>~2.4 MB</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="form-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            <i className="fas fa-times"></i>
            Close
          </button>
          {type === 'edit' && (
            <button type="button" className="btn" onClick={handleSave}>
              <i className="fas fa-save"></i>
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPDFInvoiceModal;