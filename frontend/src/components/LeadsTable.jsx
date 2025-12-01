import React, { useState, useEffect } from 'react';
import LeadRow from './LeadRow';
import AddLeadModal from './AddLeadModal';
import UniversalTableHeader from './UniversalTableHeader'; // Import the component

const LeadsTable = () => {
  const [leads, setLeads] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = 'http://72.61.171.226:8000';

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

  // Calculate lead statistics for the header
  const leadStats = [
    { value: leads.length, label: 'Total Leads' },
    { value: leads.filter(lead => lead.status === 'New').length, label: 'New' },
    { value: leads.filter(lead => lead.status === 'Contacted').length, label: 'Contacted' },
    { value: leads.filter(lead => lead.status === 'Qualified').length, label: 'Qualified' }
  ];

  const handleExport = () => {
    // Export logic here
    console.log('Export leads clicked');
  };

  if (loading) {
    return <div>Loading leads...</div>;
  }

  return (
    <>

      <div className="page-header">
        <div className="page-title-section">
          <div className="page-title">Leads Management</div>
          <p className="page-subtitle">Manage customer relationships and track business interactions</p>
        </div>
        <button className="page-header-btn" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus"></i> Add Customer
        </button>
      </div>
      <div className="data-table-container">
        {/* Add UniversalTableHeader */}
        <UniversalTableHeader
          stats={leadStats}
          onExport={handleExport}
        />

        <table className="data-table">
          <thead>
            <tr>
              <th>Lead ID</th>
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