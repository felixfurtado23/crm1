import React, { useState } from 'react';
import ViewEditModal from './ViewEditModal';

const LeadRow = ({ lead }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');
  const API_BASE_URL = 'http://72.61.171.226:8000';

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

const handleAction = async (action) => {
  if (action === 'view' || action === 'edit') {
    setModalType(action);
    setShowModal(true);
  } else if (action === 'convert') {
    if (confirm('Convert this lead to customer?')) {
      await convertLeadToCustomer();
    }
  } else if (action === 'delete') {
    if (confirm('Are you sure you want to delete this lead?')) {
      await deleteLead();
    }
  }
};

const convertLeadToCustomer = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/leads/${lead.id}/convert/`, {
      method: 'POST',
    });
    
    if (response.ok) {
      alert('Lead converted to customer successfully!');
      window.location.reload();
    } else {
      alert('Error converting lead');
    }
  } catch (error) {
    console.error('Error converting lead:', error);
    alert('Error converting lead');
  }
};

  const deleteLead = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leads/${lead.id}/delete/`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        alert('Lead deleted successfully!');
        window.location.reload();
      } else {
        alert('Error deleting lead');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Error deleting lead');
    }
  };

  const formatId = (id) => {
    return `LD-${String(id).padStart(4, '0')}`;
  };

  const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

  return (
    <>
      <tr>
      <td>
          <div className="lead-id">{formatId(lead.id)}</div>
        </td>
        <td>
          <div className="lead-name">{lead.name}</div>
          <div className="company-name">{lead.company}</div>
        </td>
        <td>{lead.company}</td>
        <td className="contact-info">
          <div className="contact-email">{lead.email}</div>
          <div className="contact-phone">{lead.phone}</div>
        </td>
        <td>{capitalizeFirstLetter(lead.source)}</td>
        <td>
          <span className={`status-badge ${getStatusClass(lead.status)}`}>
            {lead.status === 'proposal' ? 'Proposal Sent' : 
             lead.status.charAt(0).toUpperCase() + lead.status.slice(1).replace('-', ' ')}
          </span>
        </td>
        <td>
          <div className="action-buttons">
            <button className="action-btn view" onClick={() => handleAction('view')}>
              <i className="fas fa-eye"></i> 
            </button>
            <button className="action-btn edit" onClick={() => handleAction('edit')}>
              <i className="fas fa-edit"></i> 
            </button>
            <button className="action-btn convert" onClick={() => handleAction('convert')}>
              <i className="fas fa-user-check"></i> 
            </button>
            <button className="action-btn delete" onClick={() => handleAction('delete')}>
              <i className="fas fa-trash"></i> 
            </button>
          </div>
        </td>
      </tr>

      {showModal && (
        <ViewEditModal 
          lead={lead}
          type={modalType}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default LeadRow;