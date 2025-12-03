import React, { useState, useEffect } from 'react';
import ViewEditJournalModal from './ViewEditJournalModal';
import UniversalTableHeader from './UniversalTableHeader';

const ManualJournals = () => {
  const [journals, setJournals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [modalType, setModalType] = useState('view');

  // Hardcoded sample data
  const sampleJournals = [
    {
      id: 1,
      journalNumber: 1001,
      date: '2024-01-15',
      currency: 'AED',
      notes: 'Monthly office supplies purchase',
      status: 'Posted',
      entries: [
        { account: 'Office Supplies', description: 'Printer paper and ink', debit: '150.00', credit: '' },
        { account: 'Cash', description: 'Payment from petty cash', debit: '', credit: '150.00' }
      ],
      attachments: []
    },
    {
      id: 2,
      journalNumber: 1002,
      date: '2024-01-18',
      currency: 'AED',
      notes: 'Equipment depreciation',
      status: 'Draft',
      entries: [
        { account: 'Depreciation Expense', description: 'Monthly equipment depreciation', debit: '500.00', credit: '' },
        { account: 'Accumulated Depreciation', description: 'Office equipment', debit: '', credit: '500.00' }
      ],
      attachments: []
    },
    {
      id: 3,
      journalNumber: 1003,
      date: '2024-01-20',
      currency: 'AED',
      notes: 'Intercompany transfer',
      status: 'Posted',
      entries: [
        { account: 'Bank Account EUR', description: 'Transfer from main account', debit: '2000.00', credit: '' },
        { account: 'Bank Account USD', description: 'Transfer to EUR account', debit: '', credit: '2000.00' }
      ],
      attachments: []
    }
  ];

  // Define calculateTotals function before it's used
  const calculateTotals = (journal) => {
    const totalDebits = journal.entries.reduce((sum, entry) => sum + parseFloat(entry.debit || 0), 0);
    const totalCredits = journal.entries.reduce((sum, entry) => sum + parseFloat(entry.credit || 0), 0);
    const difference = totalDebits - totalCredits;
    
    return {
      totalDebits,
      totalCredits,
      difference,
      isBalanced: difference === 0
    };
  };

  useEffect(() => {
    // Use hardcoded data instead of API call
    setJournals(sampleJournals);
  }, []);

  // Calculate journal statistics for the header - now calculateTotals is available
  const journalStats = [
    { value: journals.length, label: 'Total Journals' },
    { value: journals.filter(j => j.status === 'Posted').length, label: 'Posted' },
    { value: journals.filter(j => j.status === 'Draft').length, label: 'Draft' },
   { 
  value: `AED ${journals.reduce((sum, journal) => {
    const totals = calculateTotals(journal);
    return sum + totals.totalDebits;
  }, 0).toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`, 
  label: 'Total Amount' 
}
  ];

  const getJournalStatusColor = (status) => {
    const colors = {
      Draft: '#fff3e0',
      Posted: '#e8f5e9',
      Reversed: '#ffebee',
      Cancelled: '#f5f5f5'
    };
    return colors[status] || '#f5f5f5';
  };

  const handleAction = (action, journal) => {
    setSelectedJournal(journal);
    setModalType(action);
    setShowModal(true);
  };

  const handleDelete = async (journalId) => {
    if (confirm('Are you sure you want to delete this journal?')) {
      // Remove from local state instead of API call
      setJournals(journals.filter(journal => journal.id !== journalId));
      alert('Journal deleted successfully!');
    }
  };

  const handlePostJournal = async (journalId) => {
    // Update local state instead of API call
    setJournals(journals.map(journal => 
      journal.id === journalId ? { ...journal, status: 'Posted' } : journal
    ));
    alert('Journal posted successfully!');
  };

  const handleSaveJournal = (newJournal) => {
    if (modalType === 'create') {
      // Add new journal with next ID
      const nextId = Math.max(...journals.map(j => j.id)) + 1;
      const nextJournalNumber = Math.max(...journals.map(j => j.journalNumber)) + 1;
      setJournals([...journals, { ...newJournal, id: nextId, journalNumber: nextJournalNumber }]);
    } else {
      // Update existing journal
      setJournals(journals.map(journal => 
        journal.id === selectedJournal.id ? newJournal : journal
      ));
    }
  };

  const handleExport = () => {
    // Export logic here
    console.log('Export journals clicked');
  };

  return (
    <div className="content-area">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Manual Journals</h1>
          <p className="page-subtitle">Create and manage manual accounting journal entries</p>
        </div>
        <button 
          className="page-header-btn"
          onClick={() => handleAction('create', null)}
        >
          <i className="fas fa-plus"></i>
          Create New Journal
        </button>
      </div>

      <div className="data-table-container">
        <UniversalTableHeader
          stats={journalStats}
          onExport={handleExport}
        />

        <table className="data-table">
          <thead>
            <tr>
              <th>Journal Number</th>
              <th>Date</th>
              <th>Currency</th>
              <th>Total Debits</th>
              <th>Total Credits</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {journals.map(journal => {
              const totals = calculateTotals(journal);
              
              return (
                <tr key={journal.id}>
                  <td>
                    <span className="journal-number">JRN-{journal.journalNumber}</span>
                  </td>
                  <td>
                    {new Date(journal.date).toLocaleDateString()}
                  </td>
                  <td>
                    {journal.currency}
                  </td>
                  <td>
                    <strong>AED {Number(totals.totalDebits).toLocaleString()}</strong>
                  </td>
                  <td>
                    <strong>AED {Number(totals.totalCredits).toLocaleString()}</strong>
                  </td>
                  <td>
                    <span 
                      className="account-type-badge"
                      style={{ backgroundColor: getJournalStatusColor(journal.status) }}
                    >
                      {journal.status}
                    </span>
                    {!totals.isBalanced && (
                      <span className="vat-badge vat-no" style={{marginLeft: '8px'}}>
                        Unbalanced
                      </span>
                    )}
                  </td>
                  <td>
                    <span className="account-description">
                      {journal.notes ? journal.notes.substring(0, 50) + '...' : 'No notes'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn view" 
                        onClick={() => handleAction('view', journal)}
                      >
                        <i className="fas fa-eye"></i> 
                      </button>
                      <button 
                        className="action-btn edit" 
                        onClick={() => handleAction('edit', journal)}
                      >
                        <i className="fas fa-edit"></i> 
                      </button>
                      {journal.status === 'Draft' && (
                        <button 
                          className="action-btn convert" 
                          onClick={() => handlePostJournal(journal.id)}
                        >
                          <i className="fas fa-check"></i> 
                        </button>
                      )}
                      <button 
                        className="action-btn delete" 
                        onClick={() => handleDelete(journal.id)}
                      >
                        <i className="fas fa-trash"></i> 
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {journals.length === 0 && (
          <div className="empty-state">
            <i className="fas fa-book fa-3x"></i>
            <h3>No Journals Found</h3>
            <p>Create your first manual journal to get started</p>
            <button 
              className="btn"
              onClick={() => handleAction('create', null)}
            >
              <i className="fas fa-plus"></i>
              Create New Journal
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <ViewEditJournalModal 
          journal={selectedJournal}
          type={modalType}
          onClose={() => {
            setShowModal(false);
            setSelectedJournal(null);
          }}
          onSave={handleSaveJournal}
        />
      )}
    </div>
  );
};

export default ManualJournals;