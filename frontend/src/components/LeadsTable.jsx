import React, { useState, useEffect } from 'react';
import LeadRow from './LeadRow';
import AddLeadModal from './AddLeadModal';

const LeadsTable = () => {
  const [leads, setLeads] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = '';

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/leads/`);
        const data = await response.json();
        setLeads(data);
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
    
  }, []);

  const addLead = (newLead) => {
    setLeads([...leads, { ...newLead, id: Date.now() }]);
    setShowAddModal(false);
  };

  if (loading) {
    return <div>Loading leads...</div>;
  }

  return (
    <>
      <div className="data-table-container">
        <div className="page-header">
          <div className="page-title">Leads Management</div>
          <button className="btn" onClick={() => setShowAddModal(true)}>
            <i className="fas fa-plus"></i> Add New Lead
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Lead Name</th>
              <th>Company</th>
              <th>Contact Info</th>
              <th>Source</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <LeadRow key={lead.id} lead={lead} />
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <AddLeadModal 
          onClose={() => setShowAddModal(false)}
          onSave={addLead}
        />
      )}
    </>
  );
};

export default LeadsTable;