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
        <div className="modal-body">
          {isView ? (
            <div className="view-customer-details">
              <div className="detail-section">
                <h4>Vendor Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Vendor Name</label>
                    <div className="detail-value">{vendor.name}</div>
                  </div>
                  <div className="detail-item">
                    <label>Company Name</label>
                    <div className="detail-value">{vendor.company}</div>
                  </div>
                  <div className="detail-item">
                    <label>Added Date</label>
                    <div className="detail-value">{vendor.addedDate}</div>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Contact Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Email Address</label>
                    <div className="detail-value">{vendor.email || 'N/A'}</div>
                  </div>
                  <div className="detail-item">
                    <label>Phone Number</label>
                    <div className="detail-value">{vendor.phone || 'N/A'}</div>
                  </div>
                </div>
                <div className="detail-item full-width">
                  <label>Address</label>
                  <div className="detail-value address-value">
                    {vendor.address || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Business Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Total Bills</label>
                    <div className="detail-value">{vendor.totalBills}</div>
                  </div>
                  <div className="detail-item">
                    <label>Total Amount</label>
                    <div className="detail-value total">${vendor.totalAmount?.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Notes</h4>
                <div className="detail-item full-width">
                  <div className="detail-value notes-value">
                    {vendor.notes || 'No notes available'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>

          <div className="modal-body">

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
              Update Vendor
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default ViewEditVendorModal;