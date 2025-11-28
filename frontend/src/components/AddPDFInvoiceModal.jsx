import React, { useState } from 'react';

const AddPDFInvoiceModal = ({ onClose, onSave }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [invoiceData, setInvoiceData] = useState({
    vendor: '',
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    amount: '',
    notes: ''
  });

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
    if (file.type === 'application/pdf') {
      setSelectedFile(file);
      
      // Simulate PDF processing and data extraction
      setTimeout(() => {
        const mockExtractedData = {
          vendor: 'ABC Supplies Co.',
          invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
          amount: (Math.random() * 5000 + 100).toFixed(2)
        };
        
        setInvoiceData(prev => ({
          ...prev,
          vendor: mockExtractedData.vendor,
          invoiceNumber: mockExtractedData.invoiceNumber,
          amount: mockExtractedData.amount
        }));
      }, 1000);
    } else {
      alert('Please select a PDF file.');
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleInputChange = (e) => {
    setInvoiceData({
      ...invoiceData,
      [e.target.name]: e.target.value
    });
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

    // Calculate VAT and totals
    const amount = parseFloat(invoiceData.amount) || 0;
    const vatAmount = (amount * 0.05).toFixed(2);
    const totalAmount = (amount + parseFloat(vatAmount)).toFixed(2);

    const newInvoice = {
      id: Date.now(),
      invoiceNumber: invoiceData.invoiceNumber,
      vendor: invoiceData.vendor,
      date: invoiceData.date,
      dueDate: invoiceData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: parseFloat(amount),
      vatAmount: parseFloat(vatAmount),
      totalAmount: parseFloat(totalAmount),
      status: 'Pending',
      pdfFile: selectedFile.name,
      notes: invoiceData.notes,
      items: [
        {
          description: 'Items from uploaded invoice',
          quantity: 1,
          unitPrice: amount,
          amount: amount
        }
      ],
      journalEntries: [
        { account: 'Accounts Payable', debit: 0, credit: parseFloat(totalAmount), description: 'Record purchase from vendor' },
        { account: 'Inventory', debit: amount, credit: 0, description: 'Record purchase of inventory' },
        { account: 'VAT Recoverable', debit: parseFloat(vatAmount), credit: 0, description: 'Record VAT receivable' }
      ]
    };

    onSave(newInvoice);
    onClose();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setInvoiceData({
      vendor: '',
      invoiceNumber: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      amount: '',
      notes: ''
    });
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Upload PDF Invoice</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {/* File Upload Section */}
            <div className="form-group">
              <label className="section-title">Upload PDF File</label>
              <div 
                className={`upload-area ${dragActive ? 'drag-active' : ''} ${selectedFile ? 'file-selected' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {!selectedFile ? (
                  <>
                    <div className="upload-icon">
                      <i className="fas fa-file-pdf"></i>
                    </div>
                    <div className="upload-text">
                      <h4>Drop your PDF file here</h4>
                      <p>or click to browse</p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileInput}
                      className="file-input"
                    />
                  </>
                ) : (
                  <div className="file-preview">
                    <div className="file-info">
                      <i className="fas fa-file-pdf"></i>
                      <div className="file-details">
                        <h5>{selectedFile.name}</h5>
                        <p>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button type="button" className="remove-file-btn" onClick={removeFile}>
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                )}
              </div>
              <p className="upload-hint">
                Supported format: PDF only. Maximum file size: 10MB
              </p>
            </div>

            {/* Extracted Data Section */}
            {selectedFile && (
              <>
                <div className="processing-indicator">
                  <i className="fas fa-sync fa-spin"></i>
                  <span>Processing PDF and extracting data...</span>
                </div>

                <div className="form-section">
                  <h3 className="section-title">Invoice Details</h3>
                  <p className="section-description">
                    Review and edit the extracted information from your PDF invoice.
                  </p>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Vendor Name *</label>
                      <input
                        type="text"
                        name="vendor"
                        className="form-control"
                        value={invoiceData.vendor}
                        onChange={handleInputChange}
                        placeholder="Enter vendor name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Invoice Number *</label>
                      <input
                        type="text"
                        name="invoiceNumber"
                        className="form-control"
                        value={invoiceData.invoiceNumber}
                        onChange={handleInputChange}
                        placeholder="Enter invoice number"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Invoice Date</label>
                      <input
                        type="date"
                        name="date"
                        className="form-control"
                        value={invoiceData.date}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Due Date</label>
                      <input
                        type="date"
                        name="dueDate"
                        className="form-control"
                        value={invoiceData.dueDate}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Amount (AED) *</label>
                      <input
                        type="number"
                        name="amount"
                        className="form-control"
                        value={invoiceData.amount}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Notes</label>
                    <textarea
                      name="notes"
                      className="form-control"
                      rows="3"
                      value={invoiceData.notes}
                      onChange={handleInputChange}
                      placeholder="Add any additional notes about this invoice..."
                    />
                  </div>

                  {/* Preview of calculated amounts */}
                  {invoiceData.amount && (
                    <div className="amount-preview">
                      <h4>Amount Summary</h4>
                      <div className="amount-breakdown">
                        <div className="amount-row">
                          <span>Subtotal:</span>
                          <span>{parseFloat(invoiceData.amount || 0).toFixed(2)} AED</span>
                        </div>
                        <div className="amount-row">
                          <span>VAT (5%):</span>
                          <span>{(parseFloat(invoiceData.amount || 0) * 0.05).toFixed(2)} AED</span>
                        </div>
                        <div className="amount-row total">
                          <span>Total Amount:</span>
                          <span>{(parseFloat(invoiceData.amount || 0) * 1.05).toFixed(2)} AED</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </form>
        </div>

        <div className="form-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button 
            type="button" 
            className="btn" 
            onClick={handleSubmit}
            disabled={!selectedFile}
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