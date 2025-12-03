import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);

  // Hardcoded dashboard data
  const dashboardData = {
    metrics: {
      totalLeads: 156,
      activeCustomers: 42,
      outstandingInvoices: 1257500,
      cashReceivedMTD: 857500,
      salesMTD: 1450000,
      totalReceivables: 980000,
    },
    trends: {
      salesTrend: 12.5,
      cashTrend: 8.3,
    },
    recentLeads: [
      { id: 1, name: "Ahmed Al Mansoori", status: "new", source: "website" },
      { id: 2, name: "Fatima Al Zaabi", status: "contacted", source: "referral" },
      { id: 3, name: "Mohammed Al Shamsi", status: "proposal", source: "social" },
      { id: 4, name: "Layla Al Qubaisi", status: "won", source: "event" },
      { id: 5, name: "Omar Al Dhaheri", status: "contacted", source: "website" },
      { id: 6, name: "Aisha Al Hameli", status: "new", source: "referral" },
    ],
    unpaidInvoices: [
      { id: 1, number: "INV-2024-001", customer: "Alpha Trading LLC", total: 185000, status: "overdue" },
      { id: 2, number: "INV-2024-002", customer: "Beta Constructions", total: 275000, status: "sent" },
      { id: 3, number: "INV-2024-003", customer: "Gamma Solutions FZ", total: 42500, status: "sent" },
      { id: 4, number: "INV-2024-004", customer: "Delta Retail Group", total: 125000, status: "overdue" },
      { id: 5, number: "INV-2024-005", customer: "Epsilon Services", total: 67500, status: "sent" },
    ],
    quickStats: {
      conversionRate: 24.8,
      avgInvoiceValue: 125000,
      paymentCycle: 45,
    },
    charts: {
      salesTrendData: [850000, 1120000, 1450000],
      collectionTrendData: [625000, 735000, 857500],
    },
  };

  // Status badge helpers
  const getLeadStatusClass = (status) => {
    const statusMap = {
      new: "status-new",
      contacted: "status-contacted",
      proposal: "status-proposal",
      won: "status-won",
      lost: "status-lost",
    };
    return statusMap[status] || "status-new";
  };

  const getInvoiceStatusClass = (status) => {
    const statusMap = {
      draft: "status-draft",
      sent: "status-sent",
      paid: "status-paid",
      overdue: "status-overdue",
    };
    return statusMap[status] || "status-draft";
  };

  const formatLeadStatus = (status) => {
    const statusMap = {
      new: "New",
      contacted: "Contacted",
      proposal: "Proposal Sent",
      won: "Won",
      lost: "Lost",
    };
    return statusMap[status] || status;
  };

  const capitalizeWords = (string) => {
    if (!string) return '';
    return string
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatTrend = (trend) => {
    if (trend > 0)
      return { class: "up", text: `+${Math.abs(trend)}% from last month` };
    if (trend < 0)
      return { class: "down", text: `-${Math.abs(trend)}% from last month` };
    return { class: "", text: "No change from last month" };
  };

  // Quick actions handlers
  const handleAddLead = () => (window.location.href = "/leads");
  const handleCreateInvoice = () => (window.location.href = "/invoicing");
  const handleRecordPayment = () =>
    alert("Payment recording feature coming soon!");
  const handleGenerateReport = () =>
    alert("Report generation feature coming soon!");

  if (loading) {
    return (
      <div className="dashboard">
        <main className="main-content">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            Loading dashboard data...
          </div>
        </main>
      </div>
    );
  }

  const { metrics, trends, recentLeads, unpaidInvoices, quickStats, charts } =
    dashboardData;
  const salesTrend = formatTrend(trends.salesTrend);
  const cashTrend = formatTrend(trends.cashTrend);
  const taxAmount = metrics.outstandingInvoices * 0.05;
  const receivableExVat = metrics.outstandingInvoices - taxAmount;

  const progressPercentage = Math.min(
    (metrics.cashReceivedMTD / metrics.outstandingInvoices) * 100,
    100
  );

  return (
    <div className="dashboard">
      <main className="main-content">
        {/* Key Metrics - Top 4 Cards */}
        <section className="cards-row">
          <div className="card four-col-card kpi-card">
            <div className="card-title">
              Total Leads
              <i className="fas fa-users text-muted"></i>
            </div>
            <div className="value">{metrics.totalLeads.toLocaleString()}</div>
            <div className="label">From CRM Module</div>
            <div className={`trend ${salesTrend.class}`}>
              <i
                className={`fas fa-arrow-${
                  salesTrend.class === "up" ? "up" : "down"
                }`}
              ></i>
              {salesTrend.text}
            </div>
            <div className="chart-sparkline">
              <div className="sparkline-bar" style={{ height: "70%" }}></div>
              <div className="sparkline-bar" style={{ height: "85%" }}></div>
              <div className="sparkline-bar" style={{ height: "100%" }}></div>
            </div>
          </div>

          <div className="card four-col-card kpi-card">
            <div className="card-title">
              Active Customers
              <i className="fas fa-user-check text-muted"></i>
            </div>
            <div className="value">{metrics.activeCustomers.toLocaleString()}</div>
            <div className="label">From CRM Module</div>
            <div className={`trend ${salesTrend.class}`}>
              <i
                className={`fas fa-arrow-${
                  salesTrend.class === "up" ? "up" : "down"
                }`}
              ></i>
              {salesTrend.text}
            </div>
            <div className="chart-sparkline">
              <div className="sparkline-bar" style={{ height: "60%" }}></div>
              <div className="sparkline-bar" style={{ height: "80%" }}></div>
              <div className="sparkline-bar" style={{ height: "90%" }}></div>
            </div>
          </div>

          <div className="card four-col-card kpi-card">
            <div className="card-title">
              Outstanding Invoices
              <i className="fas fa-file-invoice-dollar text-muted"></i>
            </div>
            <div className="value">
              AED {metrics.outstandingInvoices.toLocaleString()}
            </div>
            <div className="label">From Accounting Module</div>
            <div className={`trend ${cashTrend.class}`}>
              <i
                className={`fas fa-arrow-${
                  cashTrend.class === "up" ? "up" : "down"
                }`}
              ></i>
              {cashTrend.text}
            </div>
            <div className="chart-sparkline">
              <div className="sparkline-bar" style={{ height: "40%" }}></div>
              <div className="sparkline-bar" style={{ height: "65%" }}></div>
              <div className="sparkline-bar" style={{ height: "85%" }}></div>
            </div>
          </div>

          <div className="card four-col-card kpi-card activity-card">
            <div className="card-title">
              Cash Received (MTD)
              <i className="fas fa-money-bill-wave"></i>
            </div>
            <div className="value">
              AED {metrics.cashReceivedMTD.toLocaleString()}
            </div>
            <div className="label">Month-to-Date from Accounting</div>
            <div className={`trend ${cashTrend.class}`}>
              <i
                className={`fas fa-arrow-${
                  cashTrend.class === "up" ? "up" : "down"
                }`}
              ></i>
              {cashTrend.text}
            </div>
            <div className="chart-sparkline white-bars">
              <div className="sparkline-bar" style={{ height: "50%" }}></div>
              <div className="sparkline-bar" style={{ height: "75%" }}></div>
              <div className="sparkline-bar" style={{ height: "100%" }}></div>
            </div>
          </div>
        </section>

        {/* Charts Row */}
        <section className="cards-row">
          <div className="card three-col-card">
            <div className="card-title">
              Sales Trend (Last 3 Months)
              <i className="fas fa-chart-line text-muted"></i>
            </div>
            <div className="balance-chart">
              <div className="chart-bars">
                {charts.salesTrendData.map((amount, index) => (
                  <div key={index} className="chart-bar-container">
                    <div className="chart-bar-label">
                      {index === 0 ? "3 Months Ago" : index === 1 ? "Last Month" : "This Month"}
                    </div>
                    <div
                      className="chart-bar"
                      style={{
                        height: `${
                          (amount / Math.max(...charts.salesTrendData)) * 100
                        }%`,
                      }}
                    ></div>
                    <div className="chart-bar-value">
                      AED {amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="balance-values">
              <div className="balance-value">
                <div className="label">Current Month</div>
                <div className="amount">
                  AED {charts.salesTrendData[2]?.toLocaleString() || "0"}
                </div>
              </div>
              <div className="balance-value">
                <div className="label">Previous Month</div>
                <div className="amount">
                  AED {charts.salesTrendData[1]?.toLocaleString() || "0"}
                </div>
              </div>
            </div>
          </div>

          <div className="card three-col-card">
            <div className="card-title">
              Collection Trend (Last 3 Months)
              <i className="fas fa-chart-bar text-muted"></i>
            </div>
            <div className="balance-chart">
              <div className="chart-bars">
                {charts.collectionTrendData.map((amount, index) => (
                  <div key={index} className="chart-bar-container">
                    <div className="chart-bar-label">
                      {index === 0 ? "3 Months Ago" : index === 1 ? "Last Month" : "This Month"}
                    </div>
                    <div
                      className="chart-bar"
                      style={{
                        height: `${
                          (amount / Math.max(...charts.collectionTrendData)) * 100
                        }%`,
                      }}
                    ></div>
                    <div className="chart-bar-value">
                      AED {amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="balance-values">
              <div className="balance-value">
                <div className="label">Current Month</div>
                <div className="amount">
                  AED {charts.collectionTrendData[2]?.toLocaleString() || "0"}
                </div>
              </div>
              <div className="balance-value">
                <div className="label">Previous Month</div>
                <div className="amount">
                  AED {charts.collectionTrendData[1]?.toLocaleString() || "0"}
                </div>
              </div>
            </div>
          </div>

          <div className="card three-col-card">
            <div className="card-title">
              Quick Stats
              <i className="fas fa-tachometer-alt text-muted"></i>
            </div>
            <div className="quick-stats-grid">
              <div className="quick-stat-item">
                <div className="quick-stat-icon">
                  <i className="fas fa-percentage"></i>
                </div>
                <div className="quick-stat-content">
                  <div className="quick-stat-label">Conversion Rate</div>
                  <div className="quick-stat-value">{quickStats.conversionRate}%</div>
                </div>
              </div>
              <div className="quick-stat-item">
                <div className="quick-stat-icon">
                  <i className="fas fa-file-invoice-dollar"></i>
                </div>
                <div className="quick-stat-content">
                  <div className="quick-stat-label">Avg. Invoice Value</div>
                  <div className="quick-stat-value">AED {quickStats.avgInvoiceValue.toLocaleString()}</div>
                </div>
              </div>
              <div className="quick-stat-item">
                <div className="quick-stat-icon">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <div className="quick-stat-content">
                  <div className="quick-stat-label">Payment Cycle</div>
                  <div className="quick-stat-value">{quickStats.paymentCycle} days</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Data Tables Row */}
        <section className="cards-row">
          <div className="card three-col-card">
            <div className="card-title">
              Recent Leads
              <i className="fas fa-list text-muted"></i>
            </div>
            <div className="recent-leads-container">
              {recentLeads.length === 0 ? (
                <div className="empty-state">No recent leads found</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLeads.map((lead) => (
                      <tr key={lead.id}>
                        <td>{lead.name}</td>
                        <td>
                          <span
                            className={`status-badge ${getLeadStatusClass(
                              lead.status
                            )}`}
                          >
                            {formatLeadStatus(lead.status)}
                          </span>
                        </td>
                        <td>{capitalizeWords(lead.source)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="card three-col-card">
            <div className="card-title">
              Unpaid Invoices
              <i className="fas fa-file-invoice text-muted"></i>
            </div>
            <div className="unpaid-invoices-container">
              {unpaidInvoices.length === 0 ? (
                <div className="empty-state">No unpaid invoices</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Invoice #</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unpaidInvoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td>{invoice.number}</td>
                        <td>{invoice.customer}</td>
                        <td>
                          AED {parseFloat(invoice.total || 0).toLocaleString()}
                        </td>
                        <td>
                          <span
                            className={`status-badge ${getInvoiceStatusClass(
                              invoice.status
                            )}`}
                          >
                            {invoice.status.charAt(0).toUpperCase() +
                              invoice.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="card three-col-card">
            <div className="card-title">
              Quick Actions
              <i className="fas fa-bolt text-muted"></i>
            </div>
            <div className="quick-actions-container">
              <div className="quick-actions-buttons">
                <button className="btn btn-action btn-lead" onClick={handleAddLead}>
                  <i className="fas fa-plus"></i> Add New Lead
                </button>
                <button
                  className="btn btn-action btn-invoice"
                  onClick={handleCreateInvoice}
                >
                  <i className="fas fa-plus"></i> Create Invoice
                </button>
                <button
                  className="btn btn-action btn-payment"
                  onClick={handleRecordPayment}
                >
                  <i className="fas fa-money-bill-wave"></i> Record Payment
                </button>
                <button className="btn btn-action btn-report" onClick={handleGenerateReport}>
                  <i className="fas fa-chart-bar"></i> Generate Report
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Accounting Summary */}
        <section className="cards-row">
          <div className="card three-col-card">
            <div className="card-title">
              Accounting Summary
              <i className="fas fa-calculator text-muted"></i>
            </div>
            <div className="balance-values" style={{ marginTop: "16px" }}>
              <div className="balance-value">
                <div className="label">Total Sales (MTD)</div>
                <div className="amount">
                  AED {metrics.salesMTD.toLocaleString()}
                </div>
              </div>
              <div className="balance-value">
                <div className="label">Total Receivables (ex-VAT)</div>
                <div className="amount">
                  AED {Math.round(receivableExVat).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="balance-values">
              <div className="balance-value">
                <div className="label">Cash Collected (MTD)</div>
                <div className="amount">
                  AED {metrics.cashReceivedMTD.toLocaleString()}
                </div>
              </div>
              <div className="balance-value">
                <div className="label">VAT Amount (5%)</div>
                <div className="amount">
                  AED {Math.round(taxAmount).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="progress-container">
              <div className="progress-label">
                <span>Collection Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;