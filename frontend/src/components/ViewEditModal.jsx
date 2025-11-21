import React, { useState, useEffect } from 'react';

const ViewEditModal = ({ lead, type, onClose }) => {
  const isView = type === 'view';
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
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        company: lead.company || '',
        title: lead.title || '',
        email: lead.email || '',
        phone: lead.phone || '',
        address: lead.address || '',
        source: lead.source || '',
        status: lead.status || 'new',
        addedDate: lead.addedDate || '',
        lastContact: lead.lastContact || '',
        industry: lead.industry || '',
        annualRevenue: lead.annualRevenue || '',
        notes: lead.notes || ''
      });
    }
  }, [lead]);

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formData.name || !formData.company) {
    alert('Please fill in all required fields');
    return;
  }

  try {
    const dataToSend = {
      ...formData,
      id: lead.id  
    };

    const response = await fetch(`${API_BASE_URL}/api/edit/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });
    
    if (response.ok) {
      const responseData = await response.json();
      console.log('Data sent to backend:', responseData);
      alert('Lead data sent to backend! Check Django console.');
      onClose();
      window.location.reload();
    } else {
      alert('Error sending data to backend');
    }
  } catch (error) {
    console.error('Error sending data:', error);
    alert('Error sending data to backend');
  }
};
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getStatusClass = (status) => {
    const statusMap = {
      new: 'status-new',
      contacted: 'status-contacted',
      'proposal-sent': 'status-proposal',
      proposal: 'status-proposal',
      won: 'status-won',
      lost: 'status-lost'
    };
    return statusMap[status] || 'status-new';
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{isView ? 'Lead Details' : 'Edit Lead'}</h2>
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
                  <div className="client-detail-label">Full Name</div>
                  <div className="client-detail-value">{lead.name}</div>
                </div>
                <div className="client-detail-item">
                  <div className="client-detail-label">Company</div>
                  <div className="client-detail-value">{lead.company}</div>
                </div>
                <div className="client-detail-item">
                  <div className="client-detail-label">Title</div>
                  <div className="client-detail-value">{lead.title}</div>
                </div>
              </div>
              
              <div className="client-info-section">
                <h3>Contact Information</h3>
                <div className="client-detail-item">
                  <div className="client-detail-label">Email</div>
                  <div className="client-detail-value">{lead.email}</div>
                </div>
                <div className="client-detail-item">
                  <div className="client-detail-label">Phone</div>
                  <div className="client-detail-value">{lead.phone}</div>
                </div>
                <div className="client-detail-item">
                  <div className="client-detail-label">Address</div>
                  <div className="client-detail-value" style={{whiteSpace: 'pre-line'}}>{lead.address}</div>
                </div>
              </div>
              
              <div className="client-info-section">
                <h3>Lead Information</h3>
                <div className="client-detail-item">
                  <div className="client-detail-label">Source</div>
                  <div className="client-detail-value">{lead.source}</div>
                </div>
                <div className="client-detail-item">
                  <div className="client-detail-label">Status</div>
                  <div className="client-detail-value">
                    <span className={`status-badge ${getStatusClass(lead.status)}`}>
                      {lead.status === 'proposal' ? 'Proposal Sent' : 
                       lead.status.charAt(0).toUpperCase() + lead.status.slice(1).replace('-', ' ')}
                    </span>
                  </div>
                </div>
                <div className="client-detail-item">
                  <div className="client-detail-label">Added Date</div>
                  <div className="client-detail-value">{lead.addedDate}</div>
                </div>
                <div className="client-detail-item">
                  <div className="client-detail-label">Last Contact</div>
                  <div className="client-detail-value">{lead.lastContact || 'Not contacted'}</div>
                </div>
              </div>

              <div className="client-info-section">
                <h3>Business Information</h3>
                <div className="client-detail-item">
                  <div className="client-detail-label">Industry</div>
                  <div className="client-detail-value">{lead.industry}</div>
                </div>
                <div className="client-detail-item">
                  <div className="client-detail-label">Annual Revenue</div>
                  <div className="client-detail-value">{lead.annualRevenue}</div>
                </div>
              </div>
              
              <div className="client-info-section client-notes">
                <h3>Notes</h3>
                <div className="client-notes-content">
                  {lead.notes}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
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
                  <label>Industry</label>
                  <input
                    type="text"
                    name="industry"
                    className="form-control"
                    value={formData.industry}
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
              
              <div className="form-row">
                <div className="form-group">
                  <label>Source</label>
                  <select name="source" className="form-control" value={formData.source} onChange={handleChange}>
                    <option value="">Select source</option>
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" className="form-control" value={formData.status} onChange={handleChange}>
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
                  <label>Last Contact</label>
                  <input
                    type="text"
                    name="lastContact"
                    className="form-control"
                    value={formData.lastContact}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Annual Revenue</label>
                <select name="annualRevenue" className="form-control" value={formData.annualRevenue} onChange={handleChange}>
                  <option value="">Select revenue range</option>
                  <option value="$1M - $5M">$1M - $5M</option>
                  <option value="$5M - $10M">$5M - $10M</option>
                  <option value="$10M - $25M">$10M - $25M</option>
                  <option value="$25M - $50M">$25M - $50M</option>
                  <option value="$50M - $100M">$50M - $100M</option>
                  <option value="$100M - $250M">$100M - $250M</option>
                  <option value="$250M+">$250M+</option>
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
            <button className="btn">Edit Lead</button>
          ) : (
            <button className="btn" onClick={handleSubmit}>Update Lead</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewEditModal;