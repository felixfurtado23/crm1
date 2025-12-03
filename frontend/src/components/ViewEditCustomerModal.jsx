import React, { useState, useEffect } from 'react';

const ViewEditCustomerModal = ({ customer, type, onClose }) => {
  const isView = type === 'view';
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    title: '',
    email: '',
    phone: '',
    address: '',
    addedDate: '',
    notes: '',
    totalInvoices: 0,
    totalAmount: 0
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
    if (isNaN(date.getTime())) return dateString; // Return as-is if invalid
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  // Function to parse DD/MM/YYYY to YYYY-MM-DD for date input
  const parseDateToInputFormat = (dateString) => {
    if (!dateString) return '';
    
    // If already in YYYY-MM-DD format, return as-is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Try to parse DD/MM/YYYY
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      
      // Validate if it's a valid date
      const date = new Date(`${year}-${month}-${day}`);
      if (!isNaN(date.getTime())) {
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
    
    return dateString;
  };

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        company: customer.company || '',
        title: customer.title || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        addedDate: customer.addedDate || '',
        notes: customer.notes || '',
        totalInvoices: customer.totalInvoices || 0,
        totalAmount: customer.totalAmount || 0
      });
    }
  }, [customer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.company) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        id: customer.id,
        // Ensure date is in DD/MM/YYYY format for API
        addedDate: formatDate(formData.addedDate)
      };

      console.log('Sending customer data:', dataToSend);

      const response = await fetch('http://72.61.171.226:8000/api/customers/edit/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('Customer data sent to backend:', responseData);
        alert('Customer updated successfully!');
        window.location.reload();
      } else {
        alert('Error updating customer');
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Error updating customer');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'totalAmount') {
      // For total amount field, clean the input
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
      
      setFormData({
        ...formData,
        [name]: cleanedValue
      });
    } else if (name === 'totalInvoices') {
      // For total invoices, ensure it's a positive integer
      const intValue = parseInt(value) || 0;
      setFormData({
        ...formData,
        [name]: intValue >= 0 ? intValue : 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px' }}>

        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">{isView ? 'Customer Details' : 'Edit Customer'}</h2>
            <p className="modal-subtitle">
              {isView ? 'View customer information and details' : 'Update customer information'}
            </p>
          </div>

          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {isView ? (
            <div className="view-customer-details">
              <div className="modal-form-section">
                <h4>Basic Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Customer Name</label>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>{customer.name}</div>
                  </div>
                  <div className="form-group">
                    <label>Company Name</label>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>{customer.company}</div>
                  </div>
                  <div className="form-group">
                    <label>Title</label>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>{customer.title || 'N/A'}</div>
                  </div>
                  <div className="form-group">
                    <label>Added Date</label>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>{formatDate(customer.addedDate)}</div>
                  </div>
                </div>
              </div>

              <div className="modal-form-section">
                <h4>Contact Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>{customer.email || 'N/A'}</div>
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>{customer.phone || 'N/A'}</div>
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Address</label>
                  <div className="detail-value address-value" style={{ textAlign: 'left', direction: 'ltr' }}>
                    {customer.address || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="modal-form-section">
                <h4>Business Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Total Invoices</label>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>
                      {customer.totalInvoices?.toLocaleString() || '0'}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Total Amount (AED)</label>
                    <div className="detail-value total" style={{ 
                      textAlign: 'left', 
                      direction: 'ltr',
                      fontFamily: "'Courier New', monospace",
                      fontWeight: '600',
                      color: '#059669'
                    }}>
                      AED {formatNumber(customer.totalAmount)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-form-section">
                <h4>Notes</h4>
                <div className="form-group full-width">
                  <div className="detail-value notes-value" style={{ textAlign: 'left', direction: 'ltr' }}>
                    {customer.notes || 'No notes available'}
                  </div>
                </div>
              </div>

              {customer.invoices && customer.invoices.length > 0 && (
                <div className="modal-form-section">
                  <h4>Recent Invoices</h4>
                  <div className="invoice-list">
                    {customer.invoices.map((invoice, index) => (
                      <div key={index} className="invoice-item">
                        <div className="invoice-info">
                          <div className="invoice-number" style={{ textAlign: 'left' }}>{invoice.number}</div>
                          <div className="invoice-date" style={{ textAlign: 'left' }}>{formatDate(invoice.date)}</div>
                        </div>
                        <div className="invoice-details">
                          <div className="invoice-amount" style={{ 
                            fontFamily: "'Courier New', monospace",
                            fontWeight: '600'
                          }}>
                            AED {formatNumber(invoice.amount)}
                          </div>
                          <span className={`invoice-status status-${invoice.status}`}>
                            {invoice.status?.charAt(0).toUpperCase() + invoice.status?.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="modal-form-section">
                <h4>Customer Information</h4>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Customer Name *</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      style={{ textAlign: 'left', direction: 'ltr' }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Company Name *</label>
                    <input
                      type="text"
                      name="company"
                      className="form-control"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      style={{ textAlign: 'left', direction: 'ltr' }}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      value={formData.title}
                      onChange={handleChange}
                      style={{ textAlign: 'left', direction: 'ltr' }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Added Date (DD/MM/YYYY)</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="date"
                        name="addedDate"
                        className="form-control"
                        value={parseDateToInputFormat(formData.addedDate)}
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
                    {formData.addedDate && (
                      <small style={{ 
                        color: '#6b7280', 
                        fontSize: '12px',
                        marginTop: '4px',
                        display: 'block'
                      }}>
                        Display: {formatDate(formData.addedDate)}
                      </small>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      style={{ textAlign: 'left', direction: 'ltr' }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleChange}
                      style={{ textAlign: 'left', direction: 'ltr' }}
                      placeholder="e.g., +971 50 123 4567"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Total Invoices</label>
                    <input
                      type="number"
                      name="totalInvoices"
                      className="form-control"
                      value={formData.totalInvoices}
                      onChange={handleChange}
                      min="0"
                      step="1"
                      style={{ textAlign: 'left', direction: 'ltr' }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Total Amount (AED)</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        name="totalAmount"
                        className="form-control"
                        value={formatNumber(formData.totalAmount)}
                        onChange={handleChange}
                        onFocus={(e) => {
                          // Show raw number when focused
                          e.target.value = formData.totalAmount || '';
                        }}
                        onBlur={(e) => {
                          // Format with commas when blurred
                          if (e.target.value) {
                            const num = parseFloat(e.target.value);
                            if (!isNaN(num)) {
                              e.target.value = formatNumber(num);
                            }
                          }
                        }}
                        style={{ 
                          textAlign: 'left', 
                          direction: 'ltr',
                          fontFamily: "'Courier New', monospace", 
                          fontWeight: '600',
                          paddingRight: '40px'
                        }}
                        placeholder="0.00"
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
                        AED
                      </span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    name="address"
                    className="form-control"
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                    style={{ textAlign: 'left', direction: 'ltr' }}
                  />
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    name="notes"
                    className="form-control"
                    rows="4"
                    value={formData.notes}
                    onChange={handleChange}
                    style={{ textAlign: 'left', direction: 'ltr' }}
                  />
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="modal-btn secondary" onClick={onClose} style={{ textAlign: 'center' }}>
            {isView ? 'Close' : 'Cancel'}
          </button>
          {!isView && (
            <button className="modal-btn" onClick={handleSubmit} style={{ textAlign: 'center' }}>
              Update Customer
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default ViewEditCustomerModal;