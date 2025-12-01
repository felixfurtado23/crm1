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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.company) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/leads/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add New Lead</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
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
                placeholder="Enter full address..."
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
                  placeholder="e.g., May 15, 2023"
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
                  placeholder="e.g., May 18, 2023"
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
                placeholder="Enter any notes about the lead..."
              />
            </div>
          </form>
        </div>
        <div className="form-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={handleSubmit}>Save Lead</button>
        </div>
      </div>
    </div>
  );
};

export default AddLeadModal;