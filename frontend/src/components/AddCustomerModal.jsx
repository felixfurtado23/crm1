import React, { useState } from 'react';

const AddCustomerModal = ({ onClose, onSave }) => {
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
    totalAmount: 0,
    invoices: []
  });

  const API_BASE_URL = 'http://72.61.171.226:8000';

  // Helper function to format numbers with commas
  const formatNumber = (value) => {
    if (value === '' || value === null || value === undefined) return '';
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    return num.toLocaleString();
  };

  // Function to format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return as-is if invalid
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  // Function to parse DD/MM/YYYY to YYYY-MM-DD for input[type="date"]
  const parseDateToInputFormat = (dateString) => {
    if (!dateString) return '';
    
    // If already in YYYY-MM-DD format, return as-is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Try to parse DD/MM/YYYY
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      
      // Validate if it's a valid date
      const date = new Date(`${year}-${month}-${day}`);
      if (!isNaN(date.getTime())) {
        return `${year}-${month}-${day}`;
      }
    }
    
    return '';
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
    } else if (name === 'addedDate') {
      // Store date in YYYY-MM-DD format for date input
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.company) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Format the date for API submission
      const submitData = {
        ...formData,
        totalAmount: parseFloat(formData.totalAmount) || 0,
        totalInvoices: parseInt(formData.totalInvoices) || 0,
        addedDate: formData.addedDate ? formatDate(formData.addedDate) : ''
      };

      const response = await fetch(`${API_BASE_URL}/api/customers/add/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const savedCustomer = await response.json();
        onSave(savedCustomer);
        onClose();
        window.location.reload();
      } else {
        alert('Error adding customer');
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Error adding customer');
    }
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>

        {/* 🔥 THEMED HEADER */}
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">Add Customer</h2>
            <p className="modal-subtitle">Fill the details to add a new customer</p>
          </div>

          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="modal-body">
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
                    placeholder="e.g., +971 50 123 4567"
                    style={{ textAlign: 'left', direction: 'ltr' }}
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
                  placeholder="Enter full address..."
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
                  placeholder="Enter any notes about the customer..."
                  style={{ textAlign: 'left', direction: 'ltr' }}
                />
              </div>
            </div>
          </form>
        </div>

        {/* 🔥 NEW THEMED FOOTER */}
        <div className="modal-footer">
          <button 
            className="modal-btn secondary" 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '2px solid var(--muted)',
              color: 'var(--muted)',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#f8f9fa';
              e.target.style.borderColor = '#6b7280';
              e.target.style.color = '#4b5563';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.borderColor = 'var(--muted)';
              e.target.style.color = 'var(--muted)';
            }}
          >
            Cancel
          </button>
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
              cursor: 'pointer',
              transition: 'all 0.3s ease',
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
            Save Customer
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddCustomerModal;