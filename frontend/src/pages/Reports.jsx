// import React, { useState } from 'react';

const Reports = () => {
  const handleTaxFilingDownload = (type) => {
    const pdfFiles = {
      'Corporate Tax': 'corporate-tax-filing.pdf',
      'VAT': 'vat-filing.pdf'
    };
    
    const fileName = pdfFiles[type];
    
    // For Vite, use root path from public folder
    const link = document.createElement('a');
    link.href = `/${fileName}`;  // Note: starts with / (root of public folder)
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`Downloading ${fileName}`);
  };

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Generate and view business reports</p>
        </div>
        
        <div className="page-header-buttons">
          <button 
            className="page-header-btn"
            onClick={() => handleTaxFilingDownload('Corporate Tax')}
          >
            <i className="fas fa-file-contract"></i>
            Corporate Tax Filing
          </button>
          
          <button 
            className="page-header-btn"
            onClick={() => handleTaxFilingDownload('VAT')}
          >
            <i className="fas fa-receipt"></i>
            VAT Filing
          </button>
        </div>
      </div>

      {/* Reports Sections */}
      <div className="reports-sections">
        
        {/* Tax Reports Section */}
        <section className="reports-section">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fas fa-file-invoice-dollar"></i>
              Tax Reports
            </h2>
          </div>
          <div className="report-buttons-grid">
            <button className="report-btn">
              <i className="fas fa-file-pdf"></i>
              <div className="report-btn-content">
                <div className="report-btn-title">Corporate Tax Report</div>
                <div className="report-btn-subtitle">Annual corporate tax filing</div>
              </div>
            </button>
            
            <button className="report-btn">
              <i className="fas fa-file-invoice"></i>
              <div className="report-btn-content">
                <div className="report-btn-title">VAT Return</div>
                <div className="report-btn-subtitle">Quarterly VAT filing</div>
              </div>
            </button>
            
            <button className="report-btn">
              <i className="fas fa-chart-bar"></i>
              <div className="report-btn-content">
                <div className="report-btn-title">Tax Summary</div>
                <div className="report-btn-subtitle">Year-to-date tax summary</div>
              </div>
            </button>
          </div>
        </section>

        {/* Financial Reports Section */}
        <section className="reports-section">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fas fa-chart-line"></i>
              Financial Reports
            </h2>
          </div>
          <div className="report-buttons-grid">
            <button className="report-btn">
              <i className="fas fa-balance-scale"></i>
              <div className="report-btn-content">
                <div className="report-btn-title">Balance Sheet</div>
                <div className="report-btn-subtitle">Assets, liabilities, and equity</div>
              </div>
            </button>
            
            <button className="report-btn">
              <i className="fas fa-money-bill-wave"></i>
              <div className="report-btn-content">
                <div className="report-btn-title">Profit & Loss</div>
                <div className="report-btn-subtitle">Income and expenses statement</div>
              </div>
            </button>
            
            <button className="report-btn">
              <i className="fas fa-cash-register"></i>
              <div className="report-btn-content">
                <div className="report-btn-title">Cash Flow Statement</div>
                <div className="report-btn-subtitle">Cash inflows and outflows</div>
              </div>
            </button>
          </div>
        </section>

        {/* Custom Reports Section */}
        <section className="reports-section">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fas fa-cogs"></i>
              Custom Reports
            </h2>
            {/* <button className="btn btn-primary">
              <i className="fas fa-plus"></i>
              Generate New
            </button> */}
          </div>
          <div className="report-buttons-grid">
            <button className="report-btn">
              <i className="fas fa-user-clock"></i>
              <div className="report-btn-content">
                <div className="report-btn-title">Overdues by Customer</div>
                <div className="report-btn-subtitle">View overdue invoices per customer</div>
              </div>
            </button>
            
            <button className="report-btn">
              <i className="fas fa-box-open"></i>
              <div className="report-btn-content">
                <div className="report-btn-title">Inventory Obsolescence Report</div>
                <div className="report-btn-subtitle">Track slow-moving inventory</div>
              </div>
            </button>
          </div>
        </section>

      </div>

      <style jsx>{`
        .reports-sections {
          display: flex;
          flex-direction: column;
          gap: 32px;
          padding: 20px 0;
        }
        
        .reports-section {
          background: var(--card);
          border-radius: 12px;
          box-shadow: var(--shadow);
          padding: 24px;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: var(--text);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .section-title i {
          color: var(--blue-2);
        }
        
        .report-buttons-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .report-btn {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px;
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 10px;
          text-align: left;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .report-btn:hover {
          background: var(--blue-1);
          border-color: var(--blue-1);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .report-btn:hover * {
          color: white !important;
        }
        
        .report-btn i {
          font-size: 24px;
          color: var(--blue-2);
          margin-top: 4px;
        }
        
        .report-btn-content {
          flex: 1;
        }
        
        .report-btn-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 6px;
        }
        
        .report-btn-subtitle {
          font-size: 13px;
          color: var(--muted);
          line-height: 1.4;
        }
        
        @media (max-width: 768px) {
          .report-buttons-grid {
            grid-template-columns: 1fr;
          }
          
          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          
          .section-header .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default Reports;