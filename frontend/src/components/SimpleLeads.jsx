import React, { useState, useEffect } from 'react';

const SimpleLeads = () => {
  const [leads, setLeads] = useState([]);
  const API_BASE_URL = 'http://localhost:8000';

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/leads/`);
        const data = await response.json();
        setLeads(data);
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };

    fetchLeads();
  }, []);

  return (
    <div>
      <h1>Leads from Django API</h1>
      {leads.map(lead => (
        <h1 key={lead.id}>{lead.name} - {lead.company}</h1>
      ))}
    </div>
  );
};

export default SimpleLeads;