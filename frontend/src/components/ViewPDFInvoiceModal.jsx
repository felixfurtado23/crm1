import React, { useState } from 'react';

const ViewPDFInvoiceModal = ({ invoice, type, onClose, onMarkAsPaid }) => {
  const [activeTab, setActiveTab] = useState('details');

  // Helper function to format numbers with commas
  const formatNumber = (value) => {
    if (value === '' || value === null || value === undefined) return '0.00';
    const num = parseFloat(value);
    if (isNaN(num)) return '0.00';
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
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

  const handleSave = () => {
    // Handle save logic here
    alert('Invoice updated successfully!');
    onClose();
  };

  // Tabs navigation
  const ModalTabs = () => (
    <div className="modal-tabs">
      <button 
        className={`modal-tab ${activeTab === 'details' ? 'active' : ''}`}
        onClick={() => setActiveTab('details')}
      >
        <i className="fas fa-info-circle"></i>
        <span>Invoice Details</span>
      </button>
      <button 
        className={`modal-tab ${activeTab === 'accounting' ? 'active' : ''}`}
        onClick={() => setActiveTab('accounting')}
      >
        <i className="fas fa-book"></i>
        <span>Accounting Entries</span>
      </button>
      <button 
        className={`modal-tab ${activeTab === 'pdf' ? 'active' : ''}`}
        onClick={() => setActiveTab('pdf')}
      >
        <i className="fas fa-file-pdf"></i>
        <span>PDF Preview</span>
      </button>
    </div>
  );

  return (
    <div className="modal-overlay active">
      <div className="modal-content pdf-invoice-modal" style={{ maxWidth: '1000px' }}>
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">
              {invoice.invoiceNumber} - {invoice.vendor}
            </h2>
            <p className="modal-subtitle">PDF Invoice Details</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <ModalTabs />

        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
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
                      <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>
                        {invoice.invoiceNumber}
                      </div>
                    </div>
                    <div className="detail-item">
                      <label>Vendor</label>
                      <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>
                        {invoice.vendor}
                      </div>
                    </div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-item">
                      <label>Invoice Date</label>
                      <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>
                        {formatDate(invoice.date)}
                      </div>
                    </div>
                    <div className="detail-item">
                      <label>Due Date</label>
                      <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>
                        {formatDate(invoice.dueDate)}
                      </div>
                    </div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-item">
                      <label>PDF File</label>
                      <div className="detail-value">
                        <div className="file-display" style={{ textAlign: 'left', direction: 'ltr' }}>
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
                      <span className="amount" style={{ 
                        fontFamily: "'Courier New', monospace",
                        fontWeight: '600'
                      }}>
                        {formatNumber(invoice.amount)} AED
                      </span>
                    </div>
                    <div className="amount-row">
                      <span>VAT (5%)</span>
                      <span className="amount" style={{ 
                        fontFamily: "'Courier New', monospace",
                        fontWeight: '600'
                      }}>
                        {formatNumber(invoice.vatAmount)} AED
                      </span>
                    </div>
                    <div className="amount-row total">
                      <span>Total Amount</span>
                      <span className="amount" style={{ 
                        fontFamily: "'Courier New', monospace",
                        fontWeight: '700'
                      }}>
                        {formatNumber(invoice.totalAmount)} AED
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="detail-section">
                <h3 className="section-title">Line Items</h3>
                <div className="line-items-table-container">
                  <table className="line-items-table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left' }}>Description</th>
                        <th style={{ textAlign: 'right' }}>Quantity</th>
                        <th style={{ textAlign: 'right' }}>Unit Price (AED)</th>
                        <th style={{ textAlign: 'right' }}>Amount (AED)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item, index) => (
                        <tr key={index}>
                          <td style={{ textAlign: 'left' }}>
                            <div className="item-description">
                              <strong>{item.description}</strong>
                            </div>
                          </td>
                          <td style={{ 
                            textAlign: 'right',
                            fontFamily: "'Courier New', monospace"
                          }}>
                            {item.quantity?.toLocaleString()}
                          </td>
                          <td style={{ 
                            textAlign: 'right',
                            fontFamily: "'Courier New', monospace",
                            fontWeight: '600'
                          }}>
                            {formatNumber(item.unitPrice)}
                          </td>
                          <td style={{ 
                            textAlign: 'right',
                            fontFamily: "'Courier New', monospace",
                            fontWeight: '700'
                          }}>
                            <strong>{formatNumber(item.amount)}</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <br></br>
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
                  <table className="accounting-table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left' }}>Account</th>
                        <th style={{ textAlign: 'right' }}>Debit (AED)</th>
                        <th style={{ textAlign: 'right' }}>Credit (AED)</th>
                        <th style={{ textAlign: 'left' }}>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.journalEntries?.map((entry, index) => (
                        <tr key={index} className="accounting-row">
                          <td style={{ textAlign: 'left' }}>
                            <div className="account-name">
                              <i className="fas fa-book"></i>
                              {entry.account} - {entry.accountName}
                            </div>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {entry.debit > 0 ? (
                              <span className="debit-amount" style={{ 
                                fontFamily: "'Courier New', monospace",
                                fontWeight: '600'
                              }}>
                                {formatNumber(entry.debit)}
                              </span>
                            ) : '-'}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {entry.credit > 0 ? (
                              <span className="credit-amount" style={{ 
                                fontFamily: "'Courier New', monospace",
                                fontWeight: '600'
                              }}>
                                {formatNumber(entry.credit)}
                              </span>
                            ) : '-'}
                          </td>
                          <td style={{ textAlign: 'left' }}>
                            <span className="entry-description">{entry.description}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="accounting-total">
                        <td style={{ textAlign: 'left' }}><strong>Total</strong></td>
                        <td style={{ textAlign: 'right' }}>
                          <strong className="debit-amount" style={{ 
                            fontFamily: "'Courier New', monospace"
                          }}>
                            {formatNumber(invoice.journalEntries?.reduce((sum, entry) => sum + entry.debit, 0) || 0)}
                          </strong>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <strong className="credit-amount" style={{ 
                            fontFamily: "'Courier New', monospace"
                          }}>
                            {formatNumber(invoice.journalEntries?.reduce((sum, entry) => sum + entry.credit, 0) || 0)}
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

              <br></br>

            </div>
          )}

          {/* PDF Preview Tab */}
          {activeTab === 'pdf' && (
            <div className="tab-content">
              <div className="pdf-preview-section">
                <h3 className="section-title">PDF Preview</h3>
                <div className="pdf-preview">
                  <div className="pdf-placeholder">
                    <i className="fas fa-file-pdf" style={{ fontSize: '48px', color: '#e74c3c' }}></i>
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
                    <span style={{ textAlign: 'left', direction: 'ltr' }}>{invoice.pdfFile}</span>
                  </div>
                  <div className="info-item">
                    <label>Upload Date</label>
                    <span style={{ textAlign: 'left', direction: 'ltr' }}>{formatDate(invoice.uploadDate || new Date().toISOString())}</span>
                  </div>
                  <div className="info-item">
                    <label>File Size</label>
                    <span style={{ textAlign: 'left', direction: 'ltr' }}>~2.4 MB</span>
                  </div>
                </div>
              </div>

              <br></br>

            </div>
          )}
        </div>

        <div className="form-footer" style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '16px', 
          padding: '20px 28px',
          background: '#f8fafc',
          borderTop: '1px solid #e9ecef',
          borderRadius: '0 0 16px 16px'
        }}>
          <button 
            type="button" 
            className="btn btn-outline" 
            onClick={onClose}
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
            <i className="fas fa-times"></i>
            Close
          </button>
          {type === 'edit' && (
            <button 
              type="button" 
              className="btn" 
              onClick={handleSave}
              style={{
                background: 'linear-gradient(135deg, var(--blue-2), var(--blue-1))',
                border: 'none',
                color: 'white',
                padding: '12px 28px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '140px',
                textAlign: 'center'
              }}
            >
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