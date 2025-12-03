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
      { period: 'Current', amount: 18250, percentage: 43, color: '#4CAF50' },
      { period: '1-30 Days', amount: 12450, percentage: 29, color: '#2196F3' },
      { period: '31-60 Days', amount: 8720, percentage: 20, color: '#FFC107' },
      { period: '61-90 Days', amount: 2160, percentage: 5, color: '#FF9800' },
      { period: '>90 Days', amount: 1000, percentage: 3, color: '#F44336' }
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





  const PieChart = ({ data, title }) => {
    let currentAngle = 0;
    
    return (
      <div className="pie-chart-container">
        <div className="pie-chart-title">{title}</div>
        <div className="pie-chart-content">
          <svg width="200" height="200" viewBox="0 0 200 200" className="pie-chart">
            {data.map((item, index) => {
              const percentage = item.percentage;
              const angle = (percentage / 100) * 360;
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const x1 = 100 + 80 * Math.cos(currentAngle * Math.PI / 180);
              const y1 = 100 + 80 * Math.sin(currentAngle * Math.PI / 180);
              
              const x2 = 100 + 80 * Math.cos((currentAngle + angle) * Math.PI / 180);
              const y2 = 100 + 80 * Math.sin((currentAngle + angle) * Math.PI / 180);
              
              const pathData = [
                `M 100 100`,
                `L ${x1} ${y1}`,
                `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `Z`
              ].join(' ');
              
              const slice = (
                <path
                  key={index}
                  d={pathData}
                  fill={item.color}
                  stroke="#fff"
                  strokeWidth="2"
                />
              );
              
              currentAngle += angle;
              return slice;
            })}
            <circle cx="100" cy="100" r="50" fill="white" />
          </svg>
          
          <div className="pie-legend">
            {data.map((item, index) => (
              <div key={index} className="legend-item">
                <div 
                  className="legend-color" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="legend-text">
                  <span className="legend-label">{item.period}</span>
                  <span className="legend-value">{item.percentage}% (AED {item.amount.toLocaleString()})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

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
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">Business Dashboard</div>



          </div>

 

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-value">AED {reportsData.summary.totalSales.toLocaleString()}</div>
          <div className="summary-label">Total Sales</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">AED {reportsData.summary.cashCollected.toLocaleString()}</div>
          <div className="summary-label">Cash Collected</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">AED {reportsData.summary.totalReceivables.toLocaleString()}</div>
          <div className="summary-label">Total Receivables</div>
        </div>
        <div className="summary-card total">
          <div className="summary-value">{reportsData.summary.collectionRate}%</div>
          <div className="summary-label">Collection Rate</div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="reports-grid">
        {/* Receivables Aging Pie Chart */}
        <ReportCard title="Receivables Aging Overview" onExport={handleExport}>
          <PieChart data={reportsData.receivablesAging} title="Receivables Distribution" />
        </ReportCard>

        {/* Receivables Aging Table */}
        <ReportCard title="Receivables Aging Details" onExport={handleExport}>
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
                  <td>AED {item.amount.toLocaleString()}</td>
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
                  <td>AED {invoice.amount.toLocaleString()}</td>
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
                  <td>AED {item.vatCollected.toLocaleString()}</td>
                  <td>AED {item.vatPayable.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportCard>
      </div>

      <style jsx>{`
      
        .pie-chart-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pie-chart-title {
  text-align: center;
  font-weight: 700;
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 16px;
}

.pie-chart-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  width: 100%;
}

.pie-chart {
  flex-shrink: 0;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 180px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
}

.legend-item:last-child {
  border-bottom: none;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.legend-text {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.legend-label {
  font-size: 13px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2px;
}

.legend-value {
  font-size: 12px;
  color: #7f8c8d;
  font-weight: 500;
}

/* Hover effects for better interactivity */
.legend-item:hover {
  background-color: #f8f9fa;
  border-radius: 6px;
  padding: 6px 8px;
  margin: 0 -8px;
  transition: all 0.2s ease;
}

/* Responsive design */
@media (max-width: 768px) {
  .pie-chart-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .pie-chart {
    width: 180px;
    height: 180px;
  }
  
  .pie-legend {
    min-width: 100%;
  }
}

/* Animation for pie chart slices */
.pie-chart path {
  transition: opacity 0.3s ease;
}

.pie-chart path:hover {
  opacity: 0.8;
  cursor: pointer;
}
      `}</style>
    </>
  );
};

export default Reports;