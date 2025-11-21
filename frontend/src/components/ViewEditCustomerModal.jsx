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
    // Include the customer ID in the data
    const dataToSend = {
      ...formData,
      id: customer.id
    };

    console.log('Sending customer data:', dataToSend); // Add this debug line

    const response = await fetch('http://localhost:8000/api/customers/edit/', {
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{isView ? 'Customer Details' : 'Edit Customer'}</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          {isView ? (
            <div className="client-detail">
              <div className="client-info-section">
                <h3>Personal Information</h3>
                <div className="client-detail-item">
                  <div className="client-detail-label">Name</div>
                  <div className="client-detail-value">{customer.name}</div>
                </div>
                <div className="client-detail-item">
                  <div className="client-detail-label">Company</div>
                  <div className="client-detail-value">{customer.company}</div>
                </div>
                <div className="client-detail-item">
                  <div className="client-detail-label">Title</div>
                  <div className="client-detail-value">{customer.title}</div>
                </div>
              </div>

              <div className="client-info-section">
                <h3>Contact Information</h3>
                <div className="client-detail-item">
                  <div className="client-detail-label">Email</div>
                  <div className="client-detail-value">{customer.email}</div>
                </div>
                <div className="client-detail-item">
                  <div className="client-detail-label">Phone</div>
                  <div className="client-detail-value">{customer.phone}</div>
                </div>
                <div className="client-detail-item">
                  <div className="client-detail-label">Address</div>
                  <div className="client-detail-value" style={{whiteSpace: 'pre-line'}}>
                    {customer.address}
                  </div>
                </div>
              </div>

              <div className="client-info-section">
                <h3>Business Information</h3>
                <div className="client-detail-item">
                  <div className="client-detail-label">Added Date</div>
                  <div className="client-detail-value">{customer.addedDate}</div>
                </div>
                <div className="client-detail-item">
                  <div className="client-detail-label">Total Invoices</div>
                  <div className="client-detail-value">{customer.totalInvoices}</div>
                </div>
                <div className="client-detail-item">
                  <div className="client-detail-label">Total Amount</div>
                  <div className="client-detail-value">${customer.totalAmount}</div>
                </div>
              </div>

              <div className="client-info-section client-notes">
                <h3>Notes</h3>
                <div className="client-notes-content">
                  {customer.notes}
                </div>
              </div>

              <div className="client-info-section client-invoices">
                <h3>Invoices</h3>
                <div className="invoice-list">
                  {customer.invoices?.map((invoice, index) => (
                    <div key={index} className="invoice-item">
                      <div>
                        <div className="invoice-number">{invoice.number}</div>
                        <div className="invoice-date">Date: {invoice.date}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="invoice-amount">${invoice.amount}</div>
                        <span className={`invoice-status invoice-${invoice.status}`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
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

              <div className="form-group">
                <label>Added Date</label>
                <input
                  type="text"
                  name="addedDate"
                  className="form-control"
                  value={formData.addedDate}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  className="form-control"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
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
                />
              </div>
            </form>
          )}
        </div>
        <div className="form-footer">
          <button className="btn btn-outline" onClick={onClose}>
            {isView ? 'Close' : 'Cancel'}
          </button>
          {isView ? (
            <button className="btn">Edit Customer</button>
          ) : (
            <button className="btn" onClick={handleSubmit}>Update Customer</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewEditCustomerModal;