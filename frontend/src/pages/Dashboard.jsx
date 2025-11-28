import React, { useState, useEffect } from "react";
import "./Dashboard.css";
const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      totalLeads: 0,
      activeCustomers: 0,
      outstandingInvoices: 0,
      cashReceivedMTD: 0,
      salesMTD: 0,
      totalReceivables: 0,
    },
    trends: {
      salesTrend: 0,
      cashTrend: 0,
    },
    recentLeads: [],
    unpaidInvoices: [],
    quickStats: {
      conversionRate: 0,
      avgInvoiceValue: 0,
      paymentCycle: 0,
    },
    charts: {
      salesTrendData: [0, 0, 0],
      collectionTrendData: [0, 0, 0],
    },
  });

  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "http://localhost:8000";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/metrics/`);
      const data = await response.json();
      setDashboardData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
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

  const formatTrend = (trend) => {
    if (trend > 0)
      return { class: "up", text: `${Math.abs(trend)}% from last month` };
    if (trend < 0)
      return { class: "down", text: `${Math.abs(trend)}% from last month` };
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

  const progressPercentage =
    metrics.outstandingInvoices > 0
      ? (metrics.cashReceivedMTD / metrics.outstandingInvoices) * 100
      : 0;

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
            <div className="value">{metrics.totalLeads}</div>
            <div className="label">From CRM Module</div>
            <div className={`trend ${salesTrend.class}`}>
              <i
                className={`fas fa-arrow-${
                  salesTrend.class === "up" ? "up" : "down"
                }`}
              ></i>
              {salesTrend.text}
            </div>
            <div className="chart"></div>
          </div>

          <div className="card four-col-card kpi-card">
            <div className="card-title">
              Active Customers
              <i className="fas fa-user-check text-muted"></i>
            </div>
            <div className="value">{metrics.activeCustomers}</div>
            <div className="label">From CRM Module</div>
            <div className={`trend ${salesTrend.class}`}>
              <i
                className={`fas fa-arrow-${
                  salesTrend.class === "up" ? "up" : "down"
                }`}
              ></i>
              {salesTrend.text}
            </div>
            <div className="chart"></div>
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
            <div className="chart"></div>
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
            <div className="chart"></div>
          </div>
        </section>

        {/* Charts Row */}
        <section className="cards-row">
          <div className="card three-col-card">
            <div className="card-title">
              Sales Trend (Last 3 Months)
              <i className="fas fa-chart-line text-muted"></i>
            </div>
            <div
              className="balance-chart"
              style={{
                height: "200px",
                background:
                  "linear-gradient(180deg, var(--green-1) 0%, var(--green-2) 100%)",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-around",
                padding: "20px",
              }}
            >
              {charts.salesTrendData.map((amount, index) => (
                <div
                  key={index}
                  style={{
                    width: "30%",
                    height: `${
                      (amount / Math.max(...charts.salesTrendData)) * 100
                    }%`,
                    backgroundColor: "white",
                    borderRadius: "4px 4px 0 0",
                    minHeight: "20px",
                  }}
                ></div>
              ))}
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
            <div
              className="balance-chart"
              style={{
                height: "200px",
                background:
                  "linear-gradient(180deg, var(--blue) 0%, #3a56c5 100%)",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-around",
                padding: "20px",
              }}
            >
              {charts.collectionTrendData.map((amount, index) => (
                <div
                  key={index}
                  style={{
                    width: "30%",
                    height: `${
                      (amount /
                        Math.max(
                          ...charts.collectionTrendData.filter((val) => val > 0)
                        ) || 1) * 100
                    }%`,
                    backgroundColor: "white",
                    borderRadius: "4px 4px 0 0",
                    minHeight: "20px",
                  }}
                ></div>
              ))}
            </div>
            <div className="balance-values">
              <div className="balance-value">
                <div className="label">Current Month</div>
                <div className="amount">
                  AED{charts.collectionTrendData[2]?.toLocaleString() || "0"}
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
            <div style={{ padding: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span>Conversion Rate</span>
                <strong>{quickStats.conversionRate}%</strong>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span>Avg. Invoice Value</span>
                <strong>AED {quickStats.avgInvoiceValue}</strong>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span>Payment Cycle</span>
                <strong>{quickStats.paymentCycle} days</strong>
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
                        <td>{lead.source}</td>
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
                <button className="btn btn-secondary" onClick={handleAddLead}>
                  <i className="fas fa-plus"></i> Add New Lead
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleCreateInvoice}
                >
                  <i className="fas fa-plus"></i> Create Invoice
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleRecordPayment}
                >
                  <i className="fas fa-money-bill-wave"></i> Record Payment
                </button>
                <button className="btn" onClick={handleGenerateReport}>
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
                <div className="amount" style={{ textAlign: "right" }}>
                  AED 
                  {receivableExVat.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
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
                  AED 
                   {taxAmount.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>
            <div
              className="balance-chart"
              style={{
                height: "80px",
                marginTop: "16px",
                background: `linear-gradient(90deg, var(--green-2) 0%, var(--green-2) ${progressPercentage}%, var(--muted-green) ${progressPercentage}%, var(--muted-green) 100%)`,
              }}
            ></div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
