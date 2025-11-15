// import React, { useState } from 'react';

const Reports = () => {
//   const [dateRange, setDateRange] = useState('This Month');
//   const [startDate, setStartDate] = useState('2024-01-01');
//   const [endDate, setEndDate] = useState('2024-01-31');

  // Mock data - you'll replace with real API calls
  const reportsData = {
    summary: {
      totalSales: 42800,
      cashCollected: 28450,
      totalReceivables: 42580,
      collectionRate: 86
    },
    receivablesAging: [
      { period: 'Current', amount: 18250, percentage: 43 },
      { period: '1-30 Days', amount: 12450, percentage: 29 },
      { period: '31-60 Days', amount: 8720, percentage: 20 },
      { period: '61-90 Days', amount: 2160, percentage: 5 },
      { period: '>90 Days', amount: 1000, percentage: 3 }
    ],
    unpaidInvoices: [
      { number: 'INV-0052', customer: 'Global Tech Inc.', date: '2024-01-15', dueDate: '2024-02-15', amount: 8820, status: 'overdue', daysOverdue: 15 },
      { number: 'INV-0050', customer: 'Innovate Labs', date: '2024-01-18', dueDate: '2024-02-18', amount: 13387, status: 'overdue', daysOverdue: 12 },
      { number: 'INV-0045', customer: 'Tech Partners LLC', date: '2024-01-12', dueDate: '2024-02-12', amount: 3255, status: 'overdue', daysOverdue: 18 }
    ],
    leadConversion: [
      { source: 'Website', leads: 45, converted: 12, rate: 27 },
      { source: 'Referral', leads: 28, converted: 10, rate: 36 },
      { source: 'Social Media', leads: 35, converted: 8, rate: 23 },
      { source: 'Other', leads: 15, converted: 3, rate: 20 }
    ],
    vatSummary: [
      { period: 'Current Month', vatCollected: 2140, vatPayable: 2129 },
      { period: 'Previous Month', vatCollected: 1980, vatPayable: 1975 },
      { period: 'Quarter-to-Date', vatCollected: 6250, vatPayable: 6220 }
    ]
  };

  const handleExport = (format) => {
    alert(`Exporting report in ${format} format`);
  };

  const SalesTrendChart = () => (
    <div className="chart-container">
      <div className="chart-bar" style={{ height: '80%' }}></div>
      <div className="chart-bar" style={{ height: '60%' }}></div>
      <div className="chart-bar" style={{ height: '90%' }}></div>
      <div className="chart-bar" style={{ height: '70%' }}></div>
      <div className="chart-bar" style={{ height: '85%' }}></div>
      <div className="chart-bar" style={{ height: '95%' }}></div>
    </div>
  );

  const ReportCard = ({ title, children, wide = false, onExport }) => (
    <div className={`report-card ${wide ? 'wide' : ''}`}>
      <div className="report-header">
        <div className="report-title">{title}</div>
        <div className="report-actions">
          <button className="action-btn" onClick={() => onExport('PDF')}>
            <i className="fas fa-download"></i> PDF
          </button>
          <button className="action-btn" onClick={() => onExport('Excel')}>
            <i className="fas fa-file-excel"></i> Excel
          </button>
        </div>
      </div>
      {children}
    </div>
  );

  return (
    <>
      {/* Module Tabs */}
      {/* <div className="module-tabs">
        <div className="module-tab">Dashboard</div>
        <div className="module-tab">CRM</div>
        <div className="module-tab">Customers</div>
        <div className="module-tab">Accounting</div>
        <div className="module-tab active">Reports</div>
      </div> */}

      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">Business Reports</div>
        {/* <div className="date-filter">
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
            <option>Custom Range</option>
          </select>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span>to</span>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button className="btn" onClick={() => handleExport('All')}>
            <i className="fas fa-download"></i> Export All
          </button>
        </div> */}
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-value">${reportsData.summary.totalSales.toLocaleString()}</div>
          <div className="summary-label">Total Sales</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">${reportsData.summary.cashCollected.toLocaleString()}</div>
          <div className="summary-label">Cash Collected</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">${reportsData.summary.totalReceivables.toLocaleString()}</div>
          <div className="summary-label">Total Receivables</div>
        </div>
        <div className="summary-card total">
          <div className="summary-value">{reportsData.summary.collectionRate}%</div>
          <div className="summary-label">Collection Rate</div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="reports-grid">
        {/* Sales Trend Report */}
        <ReportCard title="Sales Trend" onExport={handleExport}>
          <SalesTrendChart />
        </ReportCard>

        {/* Receivables Aging Report */}
        <ReportCard title="Receivables Aging" onExport={handleExport}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Aging Period</th>
                <th>Amount</th>
                <th>% of Total</th>
              </tr>
            </thead>
            <tbody>
              {reportsData.receivablesAging.map((item, index) => (
                <tr key={index}>
                  <td>{item.period}</td>
                  <td>${item.amount.toLocaleString()}</td>
                  <td>{item.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportCard>

        {/* Unpaid Invoices Report */}
        <ReportCard title="Unpaid Invoices" wide={true} onExport={handleExport}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Days Overdue</th>
              </tr>
            </thead>
            <tbody>
              {reportsData.unpaidInvoices.map((invoice, index) => (
                <tr key={index}>
                  <td>{invoice.number}</td>
                  <td>{invoice.customer}</td>
                  <td>{invoice.date}</td>
                  <td>{invoice.dueDate}</td>
                  <td>${invoice.amount.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge status-${invoice.status}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td>{invoice.daysOverdue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportCard>

        {/* Lead Conversion Report */}
        <ReportCard title="Lead Conversion" onExport={handleExport}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>Leads</th>
                <th>Converted</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {reportsData.leadConversion.map((item, index) => (
                <tr key={index}>
                  <td>{item.source}</td>
                  <td>{item.leads}</td>
                  <td>{item.converted}</td>
                  <td>{item.rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportCard>

        {/* VAT Report */}
        <ReportCard title="VAT Summary" onExport={handleExport}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>VAT Collected</th>
                <th>VAT Payable</th>
              </tr>
            </thead>
            <tbody>
              {reportsData.vatSummary.map((item, index) => (
                <tr key={index}>
                  <td>{item.period}</td>
                  <td>${item.vatCollected.toLocaleString()}</td>
                  <td>${item.vatPayable.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportCard>
      </div>
    </>
  );
};

export default Reports;