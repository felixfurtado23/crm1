import React from 'react';

const ViewEmployeeModal = ({ employee, onClose }) => {
  // Helper function to format numbers with commas
  const formatNumber = (value) => {
    if (value === '' || value === null || value === undefined) return '0.00';
    const num = parseFloat(value);
    if (isNaN(num)) return '0.00';
    return num.toLocaleString();
  };

  // Helper function to format integers with commas
  const formatInteger = (value) => {
    if (value === '' || value === null || value === undefined) return '0';
    const int = parseInt(value);
    if (isNaN(int)) return '0';
    return int.toLocaleString('en-US');
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

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>

        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">Employee Details</h2>
            <p className="modal-subtitle">View employee salary record information</p>
          </div>

          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="view-employee-details">
            <div className="modal-form-section">
              <h4>Basic Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Employee ID</label>
                  <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>{employee.id}</div>
                </div>
                <div className="form-group">
                  <label>Routing Code</label>
                  <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>{employee.routingCode}</div>
                </div>
                <div className="form-group">
                  <label>IBAN</label>
                  <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>{employee.iban}</div>
                </div>
              </div>
            </div>

            <div className="modal-form-section">
              <h4>Date Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>From Date</label>
                  <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>{formatDate(employee.fromDate)}</div>
                </div>
                <div className="form-group">
                  <label>To Date</label>
                  <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>{formatDate(employee.toDate)}</div>
                </div>
                <div className="form-group">
                  <label>No of Days</label>
                  <div className="detail-value" style={{ 
                    textAlign: 'left', 
                    direction: 'ltr',
                    fontFamily: "'Courier New', monospace",
                    fontWeight: '600'
                  }}>
                    {formatInteger(employee.noOfDays)}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-form-section">
              <h4>Salary Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Fixed Salary</label>
                  <div className="detail-value" style={{ 
                    textAlign: 'left', 
                    direction: 'ltr',
                    fontFamily: "'Courier New', monospace",
                    fontWeight: '600'
                  }}>
                    AED {formatNumber(employee.fixedSalary)}
                  </div>
                </div>
                <div className="form-group">
                  <label>Variable Pay</label>
                  <div className="detail-value" style={{ 
                    textAlign: 'left', 
                    direction: 'ltr',
                    fontFamily: "'Courier New', monospace",
                    fontWeight: '600'
                  }}>
                    AED {formatNumber(employee.variablePay)}
                  </div>
                </div>
                <div className="form-group">
                  <label>Days on Leave</label>
                  <div className="detail-value" style={{ 
                    textAlign: 'left', 
                    direction: 'ltr',
                    fontFamily: "'Courier New', monospace",
                    fontWeight: '600'
                  }}>
                    {formatInteger(employee.daysOnLeave)}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-form-section">
              <h4>Total Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Total Salary</label>
                  <div className="detail-value total" style={{ 
                    textAlign: 'left', 
                    direction: 'ltr',
                    fontFamily: "'Courier New', monospace",
                    fontWeight: '700',
                    color: '#059669'
                  }}>
                    AED {formatNumber(employee.fixedSalary + employee.variablePay)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          padding: '20px 28px',
          background: '#f8fafc',
          borderTop: '1px solid #e9ecef',
          borderRadius: '0 0 16px 16px'
        }}>
          <button 
            className="modal-btn" 
            onClick={onClose}
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
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployeeModal;