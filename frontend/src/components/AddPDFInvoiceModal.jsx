import React, { useState, useEffect } from 'react';

const AddPDFInvoiceModal = ({ onClose, onSave }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    vendor: '',
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    amount: '',
    vatAmount: '',
    totalAmount: '',
    notes: ''
  });

  const [accountingEntries, setAccountingEntries] = useState([]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      setSelectedFile(file);
      setIsProcessing(true);
      
      // Simulate PDF processing with the data from your demo invoice
      setTimeout(() => {
        // Hardcoded data extracted from the demo invoice PDF
        const extractedData = {
          vendor: 'CorpTech Solutions FZ LLC',
          invoiceNumber: 'INV-2024-00158',
          date: '2024-01-15',
          dueDate: '2024-02-14',
          amount: '121250.00',
          vatAmount: '6062.50',
          totalAmount: '127312.50',
          client: 'Alpha Trading LLC',
          clientContact: 'Mr. Ahmed Al Mansoori',
          currency: 'AED',
          items: [
            { description: 'Enterprise Software Development', quantity: 1, unitPrice: '85000.00', amount: '85000.00' },
            { description: 'Technical Support & Maintenance', quantity: 1, unitPrice: '12500.00', amount: '12500.00' },
            { description: 'Cloud Hosting Services', quantity: 1, unitPrice: '8750.00', amount: '8750.00' },
            { description: 'Data Migration Services', quantity: 1, unitPrice: '15000.00', amount: '15000.00' }
          ]
        };
        
        setInvoiceData({
          vendor: extractedData.vendor,
          invoiceNumber: extractedData.invoiceNumber,
          date: extractedData.date,
          dueDate: extractedData.dueDate,
          amount: extractedData.amount,
          vatAmount: extractedData.vatAmount,
          totalAmount: extractedData.totalAmount,
          notes: `Extracted from PDF: ${file.name}`
        });
        
        // Calculate accounting entries based on the extracted data
        const calculatedEntries = calculateAccountingEntries(extractedData.amount, extractedData.vatAmount);
        setAccountingEntries(calculatedEntries);
        
        setIsProcessing(false);
      }, 1500);
    } else {
      alert('Please select a PDF file.');
    }
  };

  // Function to calculate accounting entries
  const calculateAccountingEntries = (amount, vatAmount) => {
    const subtotal = parseFloat(amount || 0);
    const vat = parseFloat(vatAmount || 0);
    const total = subtotal + vat;

    return [
      {
        account: 'Accounts Payable',
        debit: 0,
        credit: total,
        description: 'Record purchase from vendor'
      },
      {
        account: 'Inventory',
        debit: subtotal,
        credit: 0,
        description: 'Record purchase of inventory'
      },
      {
        account: 'VAT Recoverable',
        debit: vat,
        credit: 0,
        description: 'Record VAT receivable'
      }
    ];
  };

  useEffect(() => {
    // Recalculate accounting entries when amount or VAT changes
    if (invoiceData.amount || invoiceData.vatAmount) {
      const entries = calculateAccountingEntries(invoiceData.amount, invoiceData.vatAmount);
      setAccountingEntries(entries);
    }
  }, [invoiceData.amount, invoiceData.vatAmount]);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleInputChange = (e) => {
    const updatedData = {
      ...invoiceData,
      [e.target.name]: e.target.value
    };
    setInvoiceData(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please upload a PDF file.');
      return;
    }

    if (!invoiceData.vendor || !invoiceData.invoiceNumber || !invoiceData.amount) {
      alert('Please fill all required fields.');
      return;
    }

    const newInvoice = {
      id: Date.now(),
      invoiceNumber: invoiceData.invoiceNumber,
      vendor: invoiceData.vendor,
      date: invoiceData.date,
      dueDate: invoiceData.dueDate,
      amount: parseFloat(invoiceData.amount),
      vatAmount: parseFloat(invoiceData.vatAmount),
      totalAmount: parseFloat(invoiceData.totalAmount),
      status: 'Pending',
      pdfFile: selectedFile.name,
      notes: invoiceData.notes,
      items: [
        {
          description: 'Enterprise Software Development',
          quantity: 1,
          unitPrice: 85000,
          amount: 85000
        },
        {
          description: 'Technical Support & Maintenance',
          quantity: 1,
          unitPrice: 12500,
          amount: 12500
        },
        {
          description: 'Cloud Hosting Services',
          quantity: 1,
          unitPrice: 8750,
          amount: 8750
        },
        {
          description: 'Data Migration Services',
          quantity: 1,
          unitPrice: 15000,
          amount: 15000
        }
      ],
      accountingEntries: accountingEntries
    };

    onSave(newInvoice);
    onClose();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setAccountingEntries([]);
    setInvoiceData({
      vendor: '',
      invoiceNumber: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      amount: '',
      vatAmount: '',
      totalAmount: '',
      notes: ''
    });
  };

  // Calculate totals for the accounting entries table
  const calculateAccountingTotals = () => {
    const totalDebits = accountingEntries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
    const totalCredits = accountingEntries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
    return {
      totalDebits,
      totalCredits,
      isBalanced: Math.abs(totalDebits - totalCredits) < 0.01
    };
  };

  const accountingTotals = calculateAccountingTotals();

  // Format number with commas
  const formatNumber = (num) => {
    if (num === 0 || num === '0') return '0';
    if (!num && num !== 0) return '';
    const number = parseFloat(num);
    if (isNaN(number)) return '';
    return number.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px' }}>
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">Upload & Process PDF Invoice</h2>
            <p className="modal-subtitle">Drag & drop your invoice PDF to automatically extract data</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <form onSubmit={handleSubmit}>
            {/* File Upload Section */}
            <div className="modal-form-section">
              <h4>Upload PDF Invoice</h4>
              <div 
                className={`upload-container ${dragActive ? 'drag-active' : ''} ${selectedFile ? 'has-file' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{
                  border: dragActive ? '2px dashed #667eea' : selectedFile ? '2px dashed #10b981' : '2px dashed #d1d5db',
                  background: dragActive ? '#f0f7ff' : selectedFile ? '#f0fdf4' : '#f8fafc',
                  borderRadius: '12px',
                  padding: '40px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  marginBottom: '16px'
                }}
              >
                {!selectedFile ? (
                  <>
                    <div style={{ fontSize: '48px', color: '#667eea', marginBottom: '16px' }}>
                      <i className="fas fa-file-pdf"></i>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                        Drop your invoice PDF here
                      </h4>
                      <p style={{ color: '#6b7280', fontSize: '14px' }}>
                        or click to browse files
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileInput}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer'
                      }}
                    />
                  </>
                ) : (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      background: 'white',
                      borderRadius: '10px',
                      width: '100%',
                      maxWidth: '400px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '20px'
                      }}>
                        <i className="fas fa-file-pdf"></i>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '4px'
                        }}>
                          {selectedFile.name}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: '#6b7280'
                        }}>
                          {(selectedFile.size / 1024).toFixed(1)} KB • PDF Document
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#9ca3af',
                          cursor: 'pointer',
                          padding: '8px',
                          borderRadius: '6px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                        onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                    
                    {isProcessing ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 20px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: 'white',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        <i className="fas fa-sync fa-spin"></i>
                        Processing PDF and extracting data...
                      </div>
                    ) : (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>
                        <i className="fas fa-check-circle"></i>
                        Data extracted successfully!
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center' }}>
                Supports PDF files only • Max size: 10MB
              </div>
            </div>

            {/* Extracted Data Section */}
            {selectedFile && !isProcessing && (
              <div className="modal-form-section">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px'
                }}>
                  <h4>Extracted Invoice Data</h4>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    color: '#10b981',
                    fontWeight: '600'
                  }}>
                    <i className="fas fa-robot"></i>
                    AI-Powered Extraction
                  </div>
                </div>

                {/* Invoice Summary Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '20px'
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>VENDOR</div>
                      <div style={{ fontSize: '18px', fontWeight: '700' }}>{invoiceData.vendor}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>INVOICE NUMBER</div>
                      <div style={{ fontSize: '20px', fontWeight: '800' }}>{invoiceData.invoiceNumber}</div>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '20px',
                    marginTop: '20px'
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>INVOICE DATE</div>
                      <div style={{ fontSize: '14px', fontWeight: '600' }}>{invoiceData.date}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>DUE DATE</div>
                      <div style={{ fontSize: '14px', fontWeight: '600' }}>{invoiceData.dueDate}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>TOTAL AMOUNT</div>
                      <div style={{ fontSize: '20px', fontWeight: '800' }}>AED {formatNumber(invoiceData.totalAmount)}</div>
                    </div>
                  </div>
                </div>

                {/* Editable Form Fields */}
                <div style={{ marginBottom: '24px' }}>
                  <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                        Vendor Name *
                      </label>
                      <input
                        type="text"
                        name="vendor"
                        value={invoiceData.vendor}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          transition: 'all 0.2s ease'
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                        Invoice Number *
                      </label>
                      <input
                        type="text"
                        name="invoiceNumber"
                        value={invoiceData.invoiceNumber}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          transition: 'all 0.2s ease'
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                        Invoice Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={invoiceData.date}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                        Due Date
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        value={invoiceData.dueDate}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>

                  {/* Amount Breakdown */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '10px',
                    padding: '20px',
                    border: '1px solid #e5e7eb',
                    marginTop: '20px'
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                      Amount Breakdown
                    </div>
                    
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                          Subtotal (AED)
                        </label>
                        <div style={{
                          padding: '12px 16px',
                          background: 'white',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#1f2937',
                          fontFamily: "'Courier New', monospace"
                        }}>
                          {formatNumber(invoiceData.amount)}
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                          VAT Amount (5%)
                        </label>
                        <div style={{
                          padding: '12px 16px',
                          background: 'white',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#059669',
                          fontFamily: "'Courier New', monospace"
                        }}>
                          {formatNumber(invoiceData.vatAmount)}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                        Total Amount (AED)
                      </label>
                      <div style={{
                        padding: '16px 20px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '20px',
                        fontWeight: '800',
                        color: 'white',
                        fontFamily: "'Courier New', monospace",
                        textAlign: 'center'
                      }}>
                        {formatNumber(invoiceData.totalAmount)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accounting Entry Table */}
                <div className="modal-form-section">
                  <h4 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <i className="fas fa-calculator" style={{ color: '#667eea' }}></i>
                    Accounting Entry (Accrual Basis)
                  </h4>

                  <div style={{
                    overflowX: 'auto',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      backgroundColor: 'white'
                    }}>
                      <thead>
                        <tr style={{
                          backgroundColor: '#f8fafc',
                          borderBottom: '2px solid #e5e7eb'
                        }}>
                          <th style={{
                            padding: '12px 16px',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            fontSize: '14px',
                            whiteSpace: 'nowrap'
                          }}>Account</th>
                          <th style={{
                            padding: '12px 16px',
                            textAlign: 'right',
                            fontWeight: '600',
                            color: '#374151',
                            fontSize: '14px',
                            whiteSpace: 'nowrap'
                          }}>Debit (AED)</th>
                          <th style={{
                            padding: '12px 16px',
                            textAlign: 'right',
                            fontWeight: '600',
                            color: '#374151',
                            fontSize: '14px',
                            whiteSpace: 'nowrap'
                          }}>Credit (AED)</th>
                          <th style={{
                            padding: '12px 16px',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#374151',
                            fontSize: '14px',
                            whiteSpace: 'nowrap'
                          }}>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accountingEntries.map((entry, index) => (
                          <tr key={index} style={{
                            borderBottom: '1px solid #e5e7eb',
                            transition: 'background-color 0.2s'
                          }}>
                            <td style={{
                              padding: '14px 16px',
                              fontWeight: '500',
                              color: '#1f2937',
                              fontSize: '14px'
                            }}>{entry.account}</td>
                            <td style={{
                              padding: '14px 16px',
                              textAlign: 'right',
                              fontFamily: "'Courier New', monospace",
                              fontWeight: '600',
                              color: '#2e7d32',
                              fontSize: '14px'
                            }}>
                              {entry.debit > 0 ? formatNumber(entry.debit) : '-'}
                            </td>
                            <td style={{
                              padding: '14px 16px',
                              textAlign: 'right',
                              fontFamily: "'Courier New', monospace",
                              fontWeight: '600',
                              color: '#d32f2f',
                              fontSize: '14px'
                            }}>
                              {entry.credit > 0 ? formatNumber(entry.credit) : '-'}
                            </td>
                            <td style={{
                              padding: '14px 16px',
                              color: '#6b7280',
                              fontSize: '14px'
                            }}>{entry.description}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr style={{
                          backgroundColor: '#f8fafc',
                          borderTop: '2px solid #e5e7eb'
                        }}>
                          <td style={{
                            padding: '12px 16px',
                            fontWeight: '600',
                            color: '#1f2937',
                            fontSize: '14px'
                          }}>Total</td>
                          <td style={{
                            padding: '12px 16px',
                            textAlign: 'right',
                            fontFamily: "'Courier New', monospace",
                            fontWeight: '700',
                            color: '#2e7d32',
                            fontSize: '14px'
                          }}>
                            {formatNumber(accountingTotals.totalDebits)}
                          </td>
                          <td style={{
                            padding: '12px 16px',
                            textAlign: 'right',
                            fontFamily: "'Courier New', monospace",
                            fontWeight: '700',
                            color: '#d32f2f',
                            fontSize: '14px'
                          }}>
                            {formatNumber(accountingTotals.totalCredits)}
                          </td>
                          <td style={{
                            padding: '12px 16px',
                            textAlign: 'right'
                          }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              backgroundColor: accountingTotals.isBalanced ? '#d1fae5' : '#fee2e2',
                              color: accountingTotals.isBalanced ? '#065f46' : '#991b1b'
                            }}>
                              {accountingTotals.isBalanced ? '✓ BALANCED' : '✗ UNBALANCED'}
                            </span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '16px', 
          padding: '20px 28px',
          background: '#f8fafc',
          borderTop: '1px solid #e9ecef',
          borderRadius: '0 0 16px 16px'
        }}>
          <button 
            type="button" 
            className="btn btn-outline" 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '2px solid #9ca3af',
              color: '#6b7280',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              minWidth: '120px'
            }}
          >
            Cancel
          </button>
          
          <button 
            type="button" 
            className="btn"
             style={{
              background: selectedFile ? 'linear-gradient(135deg, var(--blue-2), var(--blue-1))' : '#9ca3af',
              border: 'none',
              color: 'white',
              padding: '12px 28px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: selectedFile ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              minWidth: '160px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onClick={() => alert('Save Vendor functionality would go here')}
          >
            <i className="fas fa-save"></i>
            Save Vendor
          </button>
          
          <button 
            type="button" 
            className="btn" 
            onClick={handleSubmit}
            disabled={!selectedFile || isProcessing}
            style={{
              background: selectedFile ? 'linear-gradient(135deg, var(--blue-2), var(--blue-1))' : '#9ca3af',
              border: 'none',
              color: 'white',
              padding: '12px 28px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: selectedFile ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              minWidth: '160px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <i className="fas fa-check"></i>
            Process Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPDFInvoiceModal;