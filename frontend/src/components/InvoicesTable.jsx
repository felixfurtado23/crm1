import React, { useState, useEffect } from 'react';
import InvoiceRow from './InvoiceRow';
import AddInvoiceModal from './AddInvoiceModal';
import UniversalTableHeader from './UniversalTableHeader';

const InvoicesTable = () => {
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalCashCollected: 0,
    totalReceivables: 0
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = 'http://72.61.171.226:8000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoicesRes, summaryRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/invoices/`),
          fetch(`${API_BASE_URL}/api/invoices/summary/`)
        ]);

        const invoicesData = await invoicesRes.json();
        const summaryData = await summaryRes.json();

        // Sort invoices: overdue first, then by amount (highest to lowest)
        const sortedInvoices = sortInvoices(invoicesData);
        
        setInvoices(sortedInvoices);
        setSummary(summaryData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to check if an invoice is overdue
  const isInvoiceOverdue = (invoice) => {
    if (!invoice.dueDate) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time portion
    
    const dueDate = new Date(invoice.dueDate);
    dueDate.setHours(0, 0, 0, 0); // Remove time portion
    
    return dueDate < today && invoice.status !== 'paid';
  };

  // Function to sort invoices: overdue first, then by amount
  const sortInvoices = (invoicesArray) => {
    return [...invoicesArray].sort((a, b) => {
      // First, sort by overdue status
      const aIsOverdue = isInvoiceOverdue(a);
      const bIsOverdue = isInvoiceOverdue(b);
      
      if (aIsOverdue && !bIsOverdue) {
        return -1; // a is overdue, b is not -> a comes first
      }
      if (!aIsOverdue && bIsOverdue) {
        return 1; // b is overdue, a is not -> b comes first
      }
      
      // If both are overdue or both are not overdue, sort by amount (highest first)
      const amountA = parseFloat(a.total) || 0;
      const amountB = parseFloat(b.total) || 0;
      
      return amountB - amountA; // Descending order (highest amount first)
    });
  };

  const addInvoice = (newInvoice) => {
    // Add new invoice and re-sort
    const updatedInvoices = sortInvoices([...invoices, { ...newInvoice, id: Date.now() }]);
    setInvoices(updatedInvoices);
    setShowAddModal(false);
    fetchSummary();
  };

  const fetchSummary = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/invoices/summary/`);
      const summaryData = await response.json();
      setSummary(summaryData);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  // Calculate VAT Amount (5% of total receivables)
  const vatAmount = summary.totalReceivables * 0.05;

  // Invoice statistics for the header - using the summary fields
  const invoiceStats = [
    { value: `AED ${Math.round(summary.totalSales).toLocaleString()}`, label: 'Cash Collected YTD' },
    { value: `AED ${Math.round(summary.totalCashCollected).toLocaleString()}`, label: 'Current Receivables' },
    { value: `AED ${Math.round(vatAmount).toLocaleString()}`, label: 'Current Overdues' },
    { value: `AED ${Math.round(summary.totalReceivables).toLocaleString()}`, label: 'VAT Since Last Return' }
  ];

  const handleExport = () => {
    // Export logic here
    console.log('Export invoices clicked');
  };

  if (loading) {
    return <div>Loading invoices...</div>;
  }

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Invoice Management</h1>
          <p className="page-subtitle">Manage and track customer invoices and payments</p>
        </div>
        <button className="page-header-btn" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus"></i> Create Invoice
        </button>
      </div>

      {/* Invoices Table */}
      <div className="data-table-container">
        <UniversalTableHeader
          stats={invoiceStats}
          onExport={handleExport}
        />

        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Due Date</th>
              <th>Amount (AED)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <InvoiceRow key={invoice.id} invoice={invoice} />
            ))}
          </tbody>
        </table>

        {invoices.length === 0 && (
          <div className="data-empty-state">
            <i className="fas fa-file-invoice data-empty-icon"></i>
            <h3>No Invoices Found</h3>
            <p>Get started by creating your first invoice</p>
            <div className="data-empty-actions">
              <button className="btn" onClick={() => setShowAddModal(true)}>
                <i className="fas fa-plus"></i>
                Create Invoice
              </button>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddInvoiceModal 
          onClose={() => setShowAddModal(false)}
          onSave={addInvoice}
        />
      )}
    </>
  );
};

export default InvoicesTable;