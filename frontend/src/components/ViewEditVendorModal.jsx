import React, { useState, useEffect } from 'react';

const ViewEditVendorModal = ({ vendor, type, onClose }) => {
  const isView = type === 'view';

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    addedDate: '',
    notes: '',
    totalBills: 0,
    totalAmount: 0
  });

  // Helper function to format numbers with commas
  const formatNumber = (value) => {
    if (value === '' || value === null || value === undefined) return '';
    const num = parseFloat(value);
    if (isNaN(num)) return '';
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
    if (vendor) {
      setFormData({
        name: vendor.name || '',
        company: vendor.company || '',
        email: vendor.email || '',
        phone: vendor.phone || '',
        address: vendor.address || '',
        addedDate: vendor.addedDate || '',
        notes: vendor.notes || '',
        totalBills: vendor.totalBills || 0,
        totalAmount: vendor.totalAmount || 0
      });
    }
  }, [vendor]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.company) {
      alert('Please fill all required fields');
      return;
    }

    console.log("Updated Vendor:", { ...formData, id: vendor.id });
    alert('Vendor updated successfully (mock update)');
    onClose();
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
    } else if (name === 'totalBills') {
      // For total bills, ensure it's a positive integer
      const intValue = parseInt(value) || 0;
      setFormData({
        ...formData,
        [name]: intValue >= 0 ? intValue : 0
      });
    } else if (name === 'addedDate') {
      // Store date as entered
      setFormData({
        ...formData,
        [name]: value
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
            <h2 className="modal-title">{isView ? 'Vendor Details' : 'Edit Vendor'}</h2>
            <p className="modal-subtitle">
              {isView ? 'View vendor information and details' : 'Update vendor information'}
            </p>
          </div>

          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {isView ? (
            <div className="view-vendor-details">
              <div className="modal-form-section">
                <h4>Vendor Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Vendor Name</label>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>{vendor.name}</div>
                  </div>
                  <div className="form-group">
                    <label>Company Name</label>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>{vendor.company}</div>
                  </div>
                  <div className="form-group">
                    <label>Added Date</label>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>{formatDate(vendor.addedDate)}</div>
                  </div>
                </div>
              </div>

              <div className="modal-form-section">
                <h4>Contact Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>{vendor.email || 'N/A'}</div>
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>{vendor.phone || 'N/A'}</div>
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Address</label>
                  <div className="detail-value address-value" style={{ textAlign: 'left', direction: 'ltr' }}>
                    {vendor.address || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="modal-form-section">
                <h4>Business Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Total Bills</label>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>
                      {vendor.totalBills?.toLocaleString() || '0'}
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
                      AED {formatNumber(vendor.totalAmount)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-form-section">
                <h4>Notes</h4>
                <div className="form-group full-width">
                  <div className="detail-value notes-value" style={{ textAlign: 'left', direction: 'ltr' }}>
                    {vendor.notes || 'No notes available'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="modal-form-section">
                <h4>Basic Information</h4>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Vendor Name *</label>
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
                    <label>Total Bills</label>
                    <input
                      type="number"
                      name="totalBills"
                      className="form-control"
                      value={formData.totalBills}
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
            className="modal-btn secondary" 
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
            {isView ? 'Close' : 'Cancel'}
          </button>
          {!isView && (
            <button 
              className="modal-btn" 
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
              Update Vendor
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default ViewEditVendorModal;