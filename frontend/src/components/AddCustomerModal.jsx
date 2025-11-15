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

  const API_BASE_URL = '';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.company) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/customers/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const savedCustomer = await response.json();
        console.log('Customer added successfully:', savedCustomer);
        alert('Customer added successfully!');
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add New Customer</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
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
                />
              </div>
              <div className="form-group">
                <label>Added Date</label>
                <input
                  type="text"
                  name="addedDate"
                  className="form-control"
                  value={formData.addedDate}
                  onChange={handleChange}
                  placeholder="e.g., May 15, 2023"
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
                />
              </div>
              <div className="form-group">
                <label>Total Amount</label>
                <input
                  type="number"
                  name="totalAmount"
                  className="form-control"
                  value={formData.totalAmount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
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
              />
            </div>
          </form>
        </div>
        <div className="form-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn" onClick={handleSubmit}>
            Save Customer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerModal;