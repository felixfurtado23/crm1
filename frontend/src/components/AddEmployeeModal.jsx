import React, { useState } from 'react';

const AddEmployeeModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    routingCode: '',
    iban: '',
    fromDate: '',
    toDate: '',
    noOfDays: '',
    fixedSalary: '',
    variablePay: '',
    daysOnLeave: ''
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

  // Helper function to format integers with commas
  const formatInteger = (value) => {
    if (value === '' || value === null || value === undefined) return '';
    const int = parseInt(value);
    if (isNaN(int)) return '';
    return int.toLocaleString('en-US');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'fixedSalary' || name === 'variablePay') {
      // For salary fields, clean the input
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
        [name]: cleanedValue
      }));
    } else if (name === 'noOfDays' || name === 'daysOnLeave') {
      // For days fields, ensure it's a positive integer
      const intValue = parseInt(value) || 0;
      setFormData(prev => ({
        ...prev,
        [name]: intValue >= 0 ? intValue : 0
      }));
    } else if (name === 'fromDate' || name === 'toDate') {
      // Store date as entered
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.routingCode || !formData.iban) {
      alert('Please fill in all required fields');
      return;
    }

    onSave({
      ...formData,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      noOfDays: parseInt(formData.noOfDays.replace(/,/g, '')) || 0,
      fixedSalary: parseFloat(formData.fixedSalary.replace(/,/g, '')) || 0,
      variablePay: parseFloat(formData.variablePay.replace(/,/g, '')) || 0,
      daysOnLeave: parseInt(formData.daysOnLeave.replace(/,/g, '')) || 0
    });
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>

        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">Add Employee Record</h2>
            <p className="modal-subtitle">Fill the details to add a new employee</p>
          </div>

          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="modal-form-section">
              <h4>Employee Information</h4>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Routing Code *</label>
                  <input
                    type="text"
                    name="routingCode"
                    className="form-control"
                    value={formData.routingCode}
                    onChange={handleChange}
                    placeholder="e.g., 010, 020"
                    required
                    style={{ textAlign: 'left', direction: 'ltr' }}
                  />
                </div>

                <div className="form-group">
                  <label>IBAN *</label>
                  <input
                    type="text"
                    name="iban"
                    className="form-control"
                    value={formData.iban}
                    onChange={handleChange}
                    placeholder="AE07XXXXX..."
                    required
                    style={{ textAlign: 'left', direction: 'ltr' }}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>From Date *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="date"
                      name="fromDate"
                      className="form-control"
                      value={formData.fromDate}
                      onChange={handleChange}
                      required
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
                </div>

                <div className="form-group">
                  <label>To Date *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="date"
                      name="toDate"
                      className="form-control"
                      value={formData.toDate}
                      onChange={handleChange}
                      required
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
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>No of Days *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      name="noOfDays"
                      className="form-control"
                      value={formatInteger(formData.noOfDays)}
                      onChange={handleChange}
                      onFocus={(e) => {
                        e.target.value = formData.noOfDays || '';
                      }}
                      onBlur={(e) => {
                        if (e.target.value) {
                          const int = parseInt(e.target.value.replace(/,/g, ''));
                          if (!isNaN(int)) {
                            e.target.value = formatInteger(int);
                          }
                        }
                      }}
                      placeholder="22"
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
                      days
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Fixed Salary (AED) *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      name="fixedSalary"
                      className="form-control"
                      value={formatNumber(formData.fixedSalary)}
                      onChange={handleChange}
                      onFocus={(e) => {
                        e.target.value = formData.fixedSalary || '';
                      }}
                      onBlur={(e) => {
                        if (e.target.value) {
                          const num = parseFloat(e.target.value.replace(/,/g, ''));
                          if (!isNaN(num)) {
                            e.target.value = formatNumber(num);
                          }
                        }
                      }}
                      placeholder="5000.00"
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
                      AED
                    </span>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Variable Pay (AED)</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      name="variablePay"
                      className="form-control"
                      value={formatNumber(formData.variablePay)}
                      onChange={handleChange}
                      onFocus={(e) => {
                        e.target.value = formData.variablePay || '';
                      }}
                      onBlur={(e) => {
                        if (e.target.value) {
                          const num = parseFloat(e.target.value.replace(/,/g, ''));
                          if (!isNaN(num)) {
                            e.target.value = formatNumber(num);
                          }
                        }
                      }}
                      placeholder="1000.00"
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
                      AED
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Days on Leave</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      name="daysOnLeave"
                      className="form-control"
                      value={formatInteger(formData.daysOnLeave)}
                      onChange={handleChange}
                      onFocus={(e) => {
                        e.target.value = formData.daysOnLeave || '';
                      }}
                      onBlur={(e) => {
                        if (e.target.value) {
                          const int = parseInt(e.target.value.replace(/,/g, ''));
                          if (!isNaN(int)) {
                            e.target.value = formatInteger(int);
                          }
                        }
                      }}
                      placeholder="0"
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
                      days
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </form>
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
            Add Employee
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;