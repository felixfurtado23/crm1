import React from 'react';

const ViewEmployeeModal = ({ employee, onClose }) => {
  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

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
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Employee ID</label>
                  <div className="detail-value">{employee.id}</div>
                </div>
                <div className="detail-item">
                  <label>Routing Code</label>
                  <div className="detail-value">{employee.routingCode}</div>
                </div>
                <div className="detail-item">
                  <label>IBAN</label>
                  <div className="detail-value">{employee.iban}</div>
                </div>
              </div>
            </div>

        <div className="modal-form-section">

              <h4>Date Information</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>From Date</label>
                  <div className="detail-value">{employee.fromDate}</div>
                </div>
                <div className="detail-item">
                  <label>To Date</label>
                  <div className="detail-value">{employee.toDate}</div>
                </div>
                <div className="detail-item">
                  <label>No of Days</label>
                  <div className="detail-value">{employee.noOfDays}</div>
                </div>
              </div>
            </div>

          <div className="modal-form-section">

              <h4>Salary Information</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Fixed Salary</label>
                  <div className="detail-value">AED {employee.fixedSalary.toFixed(2)}</div>
                </div>
                <div className="detail-item">
                  <label>Variable Pay</label>
                  <div className="detail-value">AED {employee.variablePay.toFixed(2)}</div>
                </div>
                <div className="detail-item">
                  <label>Days on Leave</label>
                  <div className="detail-value">{employee.daysOnLeave}</div>
                </div>
              </div>
            </div>

       <div className="modal-form-section">

              <h4>Total Information</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Total Salary</label>
                  <div className="detail-value total">
                    AED {(employee.fixedSalary + employee.variablePay).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="modal-btn" onClick={onClose}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default ViewEmployeeModal;