import React, { useState } from 'react';

const AddLeadModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    title: '',
    email: '',
    phone: '',
    address: '',
    source: '',
    status: 'new',
    addedDate: '',
    lastContact: '',
    industry: '',
    annualRevenue: '',
    notes: ''
  });

  const API_BASE_URL = 'http://72.61.171.226:8000';

  // Function to format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.company) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Format dates before sending
      const dataToSend = {
        ...formData,
        addedDate: formatDate(formData.addedDate),
        lastContact: formatDate(formData.lastContact)
      };

      const response = await fetch(`${API_BASE_URL}/api/leads/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      
      if (response.ok) {
        const savedLead = await response.json();
        console.log('Lead added successfully:', savedLead);
        alert('Lead added successfully!');
        onSave(savedLead);
        onClose();
        window.location.reload();
      } else {
        alert('Error adding lead');
      }
    } catch (error) {
      console.error('Error adding lead:', error);
      alert('Error adding lead');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">Add New Lead</h2>
            <p className="modal-subtitle">Fill the details to add a new lead</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="modal-form-section">
              <h4>Lead Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
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
                  <label>Company *</label>
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
                  <label>Industry</label>
                  <input
                    type="text"
                    name="industry"
                    className="form-control"
                    value={formData.industry}
                    onChange={handleChange}
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
              
              <div className="form-row">
                <div className="form-group">
                  <label>Source</label>
                  <select name="source" className="form-control" value={formData.source} onChange={handleChange} style={{ textAlign: 'left', direction: 'ltr' }}>
                    <option value="">Select source</option>
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" className="form-control" value={formData.status} onChange={handleChange} style={{ textAlign: 'left', direction: 'ltr' }}>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="proposal">Proposal Sent</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>
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
                      value={formData.addedDate}
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
                <div className="form-group">
                  <label>Last Contact (DD/MM/YYYY)</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="date"
                      name="lastContact"
                      className="form-control"
                      value={formData.lastContact}
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
                  {formData.lastContact && (
                    <small style={{ 
                      color: '#6b7280', 
                      fontSize: '12px',
                      marginTop: '4px',
                      display: 'block'
                    }}>
                      Display: {formatDate(formData.lastContact)}
                    </small>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Annual Revenue</label>
       <select name="annualRevenue" className="form-control" value={formData.annualRevenue} onChange={handleChange} style={{ textAlign: 'left', direction: 'ltr' }}>
  <option value="">Select revenue range</option>
  <option value="3.67M - 18.35M AED">3.67M - 18.35M AED </option>
  <option value="18.35M - 36.7M AED">18.35M - 36.7M AED</option>
  <option value="36.7M - 91.75M AED">36.7M - 91.75M AED </option>
  <option value="91.75M - 183.5M AED">91.75M - 183.5M AED </option>
  <option value="183.5M - 367M AED">183.5M - 367M AED </option>
  <option value="367M - 917.5M AED">367M - 917.5M AED </option>
  <option value="917.5M+ AED">917.5M+ AED </option>
</select>
              </div>
              
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  className="form-control"
                  rows="4"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Enter any notes about the lead..."
                  style={{ textAlign: 'left', direction: 'ltr' }}
                />
              </div>
            </div>
          </form>
        </div>
        <div className="form-footer" style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '16px', 
          padding: '20px 28px',
          background: '#f8fafc',
          borderTop: '1px solid #e9ecef',
          borderRadius: '0 0 16px 16px'
        }}>
          <button 
            className="btn btn-outline" 
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
          >
            Cancel
          </button>
          <button 
            className="btn" 
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
          >
            Save Lead
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLeadModal;