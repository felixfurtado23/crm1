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

        setInvoices(invoicesData);
        setSummary(summaryData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addInvoice = (newInvoice) => {
    setInvoices([...invoices, { ...newInvoice, id: Date.now() }]);
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
    { value: `AED ${summary.totalSales.toLocaleString()}`, label: 'Cash Collected YTD' },
    { value: `AED ${summary.totalCashCollected.toLocaleString()}`, label: 'Current Receivables' },
    { value: `AED ${vatAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, label: 'Current Overdues' },
    { value: `AED ${summary.totalReceivables.toLocaleString()}`, label: 'VAT Since Last Return' }
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
              <th>Amount</th>
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