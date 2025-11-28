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
      const dataToSend = {
        ...formData,
        id: customer.id
      };

      console.log('Sending customer data:', dataToSend);

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
        <div className="modal-body">
          {isView ? (
            <div className="view-customer-details">
              <div className="modal-form-section">
                <h4>Basic Information</h4>
                      <div className="form-row">
              <div className="form-group">
                    <label>Customer Name</label>
                    <div className="detail-value">{customer.name}</div>
                  </div>
                  <div className="detail-item">
                    <label>Company Name</label>
                    <div className="detail-value">{customer.company}</div>
                  </div>
                  <div className="detail-item">
                    <label>Title</label>
                    <div className="detail-value">{customer.title || 'N/A'}</div>
                  </div>
                  <div className="detail-item">
                    <label>Added Date</label>
                    <div className="detail-value">{customer.addedDate}</div>
                  </div>
                </div>
              </div>

              <div className="modal-form-section">
                <h4>Contact Information</h4>
                 <div className="form-row">
              <div className="form-group">
                    <label>Email Address</label>
                    <div className="detail-value">{customer.email || 'N/A'}</div>
                  </div>
                  <div className="detail-item">
                    <label>Phone Number</label>
                    <div className="detail-value">{customer.phone || 'N/A'}</div>
                  </div>
                </div>
                <div className="detail-item full-width">
                  <label>Address</label>
                  <div className="detail-value address-value">
                    {customer.address || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="modal-form-section">
                <h4>Business Information</h4>
                     <div className="form-row">
              <div className="form-group">
                    <label>Total Invoices</label>
                    <div className="detail-value">{customer.totalInvoices}</div>
                  </div>
                  <div className="detail-item">
                    <label>Total Amount</label>
                    <div className="detail-value total">${customer.totalAmount?.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              <div className="modal-form-section">
                <h4>Notes</h4>
                <div className="detail-item full-width">
                  <div className="detail-value notes-value">
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
                          <div className="invoice-number">{invoice.number}</div>
                          <div className="invoice-date">{invoice.date}</div>
                        </div>
                        <div className="invoice-details">
                          <div className="invoice-amount">${invoice.amount?.toFixed(2)}</div>
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
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="modal-btn secondary" onClick={onClose}>
            {isView ? 'Close' : 'Cancel'}
          </button>
          {!isView && (
            <button className="modal-btn" onClick={handleSubmit}>
              Update Customer
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default ViewEditCustomerModal;