import React, { useState, useEffect } from 'react';
import InvoiceRow from './InvoiceRow';
import AddInvoiceModal from './AddInvoiceModal';

const InvoicesTable = () => {
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalCashCollected: 0,
    totalReceivables: 0
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = '';

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

  if (loading) {
    return <div>Loading invoices...</div>;
  }

  return (
    <>
      {/* Invoice Summary */}
      <div className="invoice-summary">
        <div className="summary-grid">
          <div className="summary-card total">
            <div className="summary-value">${summary.totalSales.toLocaleString()}</div>
            <div className="summary-label">Total Sales</div>
          </div>
          <div className="summary-card total">
            <div className="summary-value">${summary.totalCashCollected.toLocaleString()}</div>
            <div className="summary-label">Total Cash Collected</div>
          </div>
          <div className="summary-card total">
            <div className="summary-value">${vatAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            <div className="summary-label">VAT Amount (5%)</div>
          </div>
          <div className="summary-card total">
            <div className="summary-value">${summary.totalReceivables.toLocaleString()}</div>
            <div className="summary-label">Total Receivables</div>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">Invoice Management</div>
        <button className="btn" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus"></i> Create Invoice
        </button>
      </div>

      {/* Invoices Table */}
      <div className="data-table-container">
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