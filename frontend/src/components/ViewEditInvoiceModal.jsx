import React, { useState, useEffect } from "react";

const ViewEditInvoiceModal = ({ invoice, type, onClose }) => {
  const isView = type === "view";
  const [formData, setFormData] = useState({
    customer: "",
    date: "",
    dueDate: "",
    status: "draft",
    items: [],
  });

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
    if (invoice) {
      setFormData({
        customer: invoice.customer || "",
        date: invoice.date || "",
        dueDate: invoice.dueDate || "",
        status: invoice.status || "draft",
        items: invoice.items || [],
      });
    }
  }, [invoice]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Invoice updated successfully!");
    window.location.reload();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px' }}>
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">
              {isView ? "Invoice Details" : "Edit Invoice"}
            </h2>
            <p className="modal-subtitle">
              {isView ? "View invoice details and breakdown" : "Update invoice information"}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {isView ? (
            <div>
              <div className="modal-form-section">
                <h4>Invoice Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Invoice Number</label>
                    <div className="detail-value" style={{ 
                      textAlign: 'left', 
                      direction: 'ltr',
                      fontFamily: "'Courier New', monospace",
                      fontWeight: '600',
                      color: 'var(--blue-2)'
                    }}>
                      {invoice.number || 'N/A'}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <div className="detail-value">
                      <span className={`status-badge status-${invoice.status}`} style={{ 
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '600',
                        display: 'inline-block',
                        textAlign: 'center',
                        minWidth: '70px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        backgroundColor: invoice.status === 'paid' ? '#e8f5e9' : 
                                        invoice.status === 'pending' ? '#fff3e0' : 
                                        invoice.status === 'overdue' ? '#ffebee' : '#f5f5f5',
                        color: invoice.status === 'paid' ? '#2e7d32' : 
                              invoice.status === 'pending' ? '#f57c00' : 
                              invoice.status === 'overdue' ? '#d32f2f' : '#616161',
                        border: `1px solid ${invoice.status === 'paid' ? '#81c784' : 
                                invoice.status === 'pending' ? '#ffb74d' : 
                                invoice.status === 'overdue' ? '#e57373' : '#e0e0e0'}`
                      }}>
                        {invoice.status?.charAt(0).toUpperCase() + invoice.status?.slice(1) || 'Draft'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Customer</label>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr', fontWeight: '600' }}>
                      {invoice.customer || 'N/A'}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Invoice Date</label>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>
                      {formatDate(invoice.date)}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Due Date</label>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>
                      {formatDate(invoice.dueDate)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-form-section">
                <h4>Items</h4>
                <div className="line-items-table-container" style={{ 
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <table className="line-items-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ 
                          padding: '12px 16px', 
                          background: '#f8f9fa', 
                          textAlign: 'left',
                          fontWeight: '600',
                          color: 'var(--text)',
                          borderBottom: '2px solid #dee2e6'
                        }}>Description</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          background: '#f8f9fa', 
                          textAlign: 'right',
                          fontWeight: '600',
                          color: 'var(--text)',
                          borderBottom: '2px solid #dee2e6'
                        }}>Quantity</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          background: '#f8f9fa', 
                          textAlign: 'right',
                          fontWeight: '600',
                          color: 'var(--text)',
                          borderBottom: '2px solid #dee2e6'
                        }}>Unit Price (AED)</th>
                        <th style={{ 
                          padding: '12px 16px', 
                          background: '#f8f9fa', 
                          textAlign: 'right',
                          fontWeight: '600',
                          color: 'var(--text)',
                          borderBottom: '2px solid #dee2e6'
                        }}>Amount (AED)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items?.map((item, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td style={{ 
                            padding: '12px 16px',
                            textAlign: 'left',
                            direction: 'ltr'
                          }}>
                            {item.description || 'N/A'}
                          </td>
                          <td style={{ 
                            padding: '12px 16px',
                            textAlign: 'right',
                            direction: 'ltr',
                            fontFamily: "'Courier New', monospace"
                          }}>
                            {item.quantity?.toLocaleString() || '0'}
                          </td>
                          <td style={{ 
                            padding: '12px 16px',
                            textAlign: 'right',
                            direction: 'ltr',
                            fontFamily: "'Courier New', monospace",
                            fontWeight: '600'
                          }}>
                            AED {formatNumber(item.price)}
                          </td>
                          <td style={{ 
                            padding: '12px 16px',
                            textAlign: 'right',
                            direction: 'ltr',
                            fontFamily: "'Courier New', monospace",
                            fontWeight: '600',
                            color: 'var(--blue-2)'
                          }}>
                            AED {formatNumber(item.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                  <span style={{ fontWeight: '600' }}>Subtotal:</span>
                  <span style={{ 
                    fontFamily: "'Courier New', monospace",
                    fontWeight: '600'
                  }}>
                    AED {formatNumber(invoice.subtotal)}
                  </span>
                </div>
                <div className="total-row" style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  fontSize: '15px'
                }}>
                  <span style={{ fontWeight: '600' }}>VAT (5%):</span>
                  <span style={{ 
                    fontFamily: "'Courier New', monospace",
                    fontWeight: '600',
                    color: '#6b7280'
                  }}>
                    AED {formatNumber(invoice.vat)}
                  </span>
                </div>
                <div className="total-row final" style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  paddingTop: '16px',
                  borderTop: '2px solid #dee2e6',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: 'var(--blue-2)'
                }}>
                  <span>Total Amount:</span>
                  <span style={{ 
                    fontFamily: "'Courier New', monospace"
                  }}>
                    AED {formatNumber(invoice.total)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="modal-form-section">
                <h4>Edit Invoice</h4>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Customer *</label>
                    <input
                      type="text"
                      name="customer"
                      className="form-control"
                      value={formData.customer}
                      onChange={handleChange}
                      required
                      style={{ textAlign: 'left', direction: 'ltr' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Invoice Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={invoice.number}
                      readOnly
                      style={{ 
                        textAlign: 'left', 
                        direction: 'ltr',
                        fontFamily: "'Courier New', monospace",
                        fontWeight: '600',
                        backgroundColor: '#f8f9fa'
                      }}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Invoice Date (DD/MM/YYYY)</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="date"
                        name="date"
                        className="form-control"
                        value={formData.date.includes('/') ? '' : formData.date}
                        onChange={handleChange}
                        style={{ 
                          textAlign: 'left', 
                          direction: 'ltr',
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
                        📅
                      </span>
                    </div>
                    {formData.date && (
                      <small style={{ 
                        color: '#6b7280', 
                        fontSize: '12px',
                        marginTop: '4px',
                        display: 'block'
                      }}>
                        Display: {formatDate(formData.date)}
                      </small>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Due Date (DD/MM/YYYY)</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="date"
                        name="dueDate"
                        className="form-control"
                        value={formData.dueDate.includes('/') ? '' : formData.dueDate}
                        onChange={handleChange}
                        style={{ 
                          textAlign: 'left', 
                          direction: 'ltr',
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
                        📅
                      </span>
                    </div>
                    {formData.dueDate && (
                      <small style={{ 
                        color: '#6b7280', 
                        fontSize: '12px',
                        marginTop: '4px',
                        display: 'block'
                      }}>
                        Display: {formatDate(formData.dueDate)}
                      </small>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    className="form-control"
                    value={formData.status}
                    onChange={handleChange}
                    style={{ textAlign: 'left', direction: 'ltr' }}
                  >
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>

                {/* Add more edit fields as needed */}
              </div>
            </form>
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
            onMouseEnter={(e) => {
              e.target.style.background = '#f8f9fa';
              e.target.style.borderColor = '#6b7280';
              e.target.style.color = '#4b5563';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.borderColor = '#9ca3af';
              e.target.style.color = '#6b7280';
            }}
          >
            {isView ? "Close" : "Cancel"}
          </button>
          {!isView && (
            <button 
              className="btn" 
              onClick={handleSubmit}
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
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #2a4452, #375b6d)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, var(--blue-2), var(--blue-1))';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Update Invoice
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewEditInvoiceModal;