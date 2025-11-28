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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      fromDate: formData.fromDate.replace(/-/g, '/'),
      toDate: formData.toDate.replace(/-/g, '/'),
      noOfDays: parseInt(formData.noOfDays) || 0,
      fixedSalary: parseFloat(formData.fixedSalary) || 0,
      variablePay: parseFloat(formData.variablePay) || 0,
      daysOnLeave: parseInt(formData.daysOnLeave) || 0
    });
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

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
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>From Date (yyyy/mm/dd) *</label>
                  <input
                    type="date"
                    name="fromDate"
                    className="form-control"
                    value={formData.fromDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>To Date (yyyy/mm/dd) *</label>
                  <input
                    type="date"
                    name="toDate"
                    className="form-control"
                    value={formData.toDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>No of Days *</label>
                  <input
                    type="number"
                    name="noOfDays"
                    className="form-control"
                    value={formData.noOfDays}
                    onChange={handleChange}
                    placeholder="22"
                    min="0"
                    max="31"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Fixed Salary (AED) *</label>
                  <input
                    type="number"
                    name="fixedSalary"
                    className="form-control"
                    value={formData.fixedSalary}
                    onChange={handleChange}
                    placeholder="5000.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Variable Pay (AED)</label>
                  <input
                    type="number"
                    name="variablePay"
                    className="form-control"
                    value={formData.variablePay}
                    onChange={handleChange}
                    placeholder="1000.00"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Days on Leave</label>
                  <input
                    type="number"
                    name="daysOnLeave"
                    className="form-control"
                    value={formData.daysOnLeave}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    max="31"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="modal-btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-btn" onClick={handleSubmit}>
            Add Employee
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddEmployeeModal;