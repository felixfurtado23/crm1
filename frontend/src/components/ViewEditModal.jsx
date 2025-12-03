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
  
  const API_BASE_URL = 'http://72.61.171.226:8000';

  // Helper function to format date as DD/MM/YYYY
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

  // Function to parse DD/MM/YYYY to YYYY-MM-DD for date input
  const parseDateToInputFormat = (dateString) => {
    if (!dateString) return '';
    
    // If already in YYYY-MM-DD format, return as-is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Try to parse DD/MM/YYYY
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      
      // Validate if it's a valid date
      const date = new Date(`${year}-${month}-${day}`);
      if (!isNaN(date.getTime())) {
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
    
    return dateString;
  };

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
        id: lead.id,
        // Format dates for API
        addedDate: formatDate(formData.addedDate),
        lastContact: formatDate(formData.lastContact)
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
        alert('Lead updated successfully!');
        onClose();
        window.location.reload();
      } else {
        alert('Error updating lead');
      }
    } catch (error) {
      console.error('Error sending data:', error);
      alert('Error updating lead');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px' }}>
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">{isView ? 'Lead Details' : 'Edit Lead'}</h2>
            <p className="modal-subtitle">
              {isView ? 'View lead information and details' : 'Update lead information'}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {isView ? (
            <div className="view-lead-details">
              <div className="modal-form-section">
                <h4>Personal Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <div className="client-detail-label">Full Name</div>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>{lead.name}</div>
                  </div>
                  <div className="form-group">
                    <div className="client-detail-label">Company</div>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>{lead.company}</div>
                  </div>
                  <div className="form-group">
                    <div className="client-detail-label">Title</div>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>{lead.title || 'N/A'}</div>
                  </div>
                </div>
              </div>
              
              <div className="modal-form-section">
                <h4>Contact Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <div className="client-detail-label">Email</div>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>{lead.email || 'N/A'}</div>
                  </div>
                  <div className="form-group">
                    <div className="client-detail-label">Phone</div>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>{lead.phone || 'N/A'}</div>
                  </div>
                </div>
                <div className="form-group full-width">
                  <div className="client-detail-label">Address</div>
                  <div className="detail-value address-value" style={{ textAlign: 'left', direction: 'ltr', whiteSpace: 'pre-line' }}>
                    {lead.address || 'N/A'}
                  </div>
                </div>
              </div>
              
              <div className="modal-form-section">
                <h4>Lead Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <div className="client-detail-label">Source</div>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>{lead.source || 'N/A'}</div>
                  </div>
                  <div className="form-group">
                    <div className="client-detail-label">Status</div>
                    <div className="detail-value">
                      <span className={`status-badge ${getStatusClass(lead.status)}`}>
                        {lead.status === 'proposal' ? 'Proposal Sent' : 
                         lead.status.charAt(0).toUpperCase() + lead.status.slice(1).replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="client-detail-label">Added Date</div>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>{formatDate(lead.addedDate)}</div>
                  </div>
                  <div className="form-group">
                    <div className="client-detail-label">Last Contact</div>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>{lead.lastContact ? formatDate(lead.lastContact) : 'Not contacted'}</div>
                  </div>
                </div>
              </div>

              <div className="modal-form-section">
                <h4>Business Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <div className="client-detail-label">Industry</div>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>{lead.industry || 'N/A'}</div>
                  </div>
                  <div className="form-group">
                    <div className="client-detail-label">Annual Revenue</div>
                    <div className="detail-value" style={{ textAlign: 'left', direction: 'ltr' }}>{lead.annualRevenue || 'N/A'}</div>
                  </div>
                </div>
              </div>
              
              <div className="modal-form-section">
                <h4>Notes</h4>
                <div className="form-group full-width">
                  <div className="detail-value notes-value" style={{ textAlign: 'left', direction: 'ltr' }}>
                    {lead.notes || 'No notes available'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
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
                        value={parseDateToInputFormat(formData.addedDate)}
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
                        value={parseDateToInputFormat(formData.lastContact)}
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
  <option value="3.67M - 18.35M AED">3.67M - 18.35M AED</option>
  <option value="18.35M - 36.7M AED">18.35M - 36.7M AED</option>
  <option value="36.7M - 91.75M AED">36.7M - 91.75M AED</option>
  <option value="91.75M - 183.5M AED">91.75M - 183.5M AED</option>
  <option value="183.5M - 367M AED">183.5M - 367M AED</option>
  <option value="367M - 917.5M AED">367M - 917.5M AED</option>
  <option value="917.5M+ AED">917.5M+ AED</option>
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
                    style={{ textAlign: 'left', direction: 'ltr' }}
                  />
                </div>
              </div>
            </form>
          )}
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
            {isView ? 'Close' : 'Cancel'}
          </button>
          {isView ? (
            <button className="btn" style={{ textAlign: 'center' }}>Edit Lead</button>
          ) : (
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
              Update Lead
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewEditModal;