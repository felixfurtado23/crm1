import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';

const AddInvoiceModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    customer: '',
    date: '',
    dueDate: '',
    status: 'draft',
    items: [{ description: '', quantity: 1, price: 0, amount: 0 }]
  });

  const [customers, setCustomers] = useState([]);
  const [showCustomInvoice, setShowCustomInvoice] = useState(false);
  const [customInvoiceData, setCustomInvoiceData] = useState({
    companyName: '',
    contactPerson: '',
    title: '',
    email: '',
    phone: '',
    address: '',
    trnNumber: ''
  });
  const API_BASE_URL = 'http://72.61.171.226:8000';

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/customers/`);
        const data = await response.json();
        setCustomers(data);
        
        // Set default dates
        const today = new Date().toISOString().split('T')[0];
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);
        const dueDateStr = dueDate.toISOString().split('T')[0];
        
        setFormData(prev => ({
          ...prev,
          date: today,
          dueDate: dueDateStr
        }));
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCustomInvoiceChange = (e) => {
    setCustomInvoiceData({
      ...customInvoiceData,
      [e.target.name]: e.target.value
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    
    // Calculate amount if quantity or price changes
    if (field === 'quantity' || field === 'price') {
      const quantity = parseFloat(newItems[index].quantity) || 0;
      const price = parseFloat(newItems[index].price) || 0;
      newItems[index].amount = quantity * price;
    }
    
    setFormData({
      ...formData,
      items: newItems
    });
  };

  const addLineItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, price: 0, amount: 0 }]
    });
  };

  const removeLineItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        items: newItems
      });
    }
  };

  const calculateTotals = () => {
    if (!formData.items || !Array.isArray(formData.items)) {
      return { subtotal: 0, vat: 0, total: 0 };
    }
    
    const subtotal = formData.items.reduce((sum, item) => {
      return sum + (parseFloat(item.amount) || 0);
    }, 0);
    
    const vat = subtotal * 0.05;
    const total = subtotal + vat;
    
    return { subtotal, vat, total };
  };




const generatePDF = (isCustom = false) => {
  const { subtotal, vat, total } = calculateTotals();
  const invoiceNumber = isCustom ? `INV-CUST-${Date.now().toString().slice(-4)}` : `INV-${Date.now().toString().slice(-4)}`;
  
  const customer = isCustom ? customInvoiceData : customers.find(c => c.id == formData.customer);

  // Test the image URLs first
  const logoUrl = "https://merzaai.com/wp-content/uploads/2025/07/Merzaai-logo-1-1.png";
  const signatureUrl = "https://www.freepnglogos.com/uploads/signature-png/gary-vaynerchuk-signature-0.png";
  const stampUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ01OD98xvgcOPmQl87qxNgx-pyNdNq40YNTw&s";

  console.log('Image URLs:');
  console.log('Logo:', logoUrl);
  console.log('Signature:', signatureUrl);
  console.log('Stamp:', stampUrl);

  // Test if images load
  const testImageLoad = (url, name) => {
    const img = new Image();
    img.onload = () => console.log(`✅ ${name} loaded successfully`);
    img.onerror = () => console.log(`❌ ${name} failed to load: ${url}`);
    img.src = url;
  };

  testImageLoad(logoUrl, 'Logo');
  testImageLoad(signatureUrl, 'Signature');
  testImageLoad(stampUrl, 'Stamp');

  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  color: #1f221f;
  padding: 30px;
}

.invoice-container {
  max-width: 800px;
  margin: 0 auto;
  border: 2px solid #375b6d;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(20, 30, 20, 0.08);
    background: #ecebe6;

}

.header {
  background: linear-gradient(135deg, #375b6d 0%, #4a636e 100%);
  padding: 30px 40px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.company-info h1 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 5px;
}

.company-info .tagline {
  font-size: 14px;
  opacity: 0.9;
  font-weight: 300;
}

.logo img {
  height: 60px;
  filter: brightness(0) invert(1);
}

.invoice-title {
  background: #4a636e;
  padding: 15px 40px;
  text-align: center;
  color: white;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 1px;
}

.details-section {
  padding: 30px 40px;
  background-color: #ecebe6;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  border-bottom: 1px solid #e0e0e0;
}

.from-to h3, .invoice-meta h3 {
  font-size: 16px;
  font-weight: 600;
  color: #375b6d;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #375b6d;
}

.address-block {
  font-size: 13px;
  line-height: 1.8;
}

.address-block strong {
  display: block;
  margin-bottom: 5px;
  color: #1f221f;
}

.meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin-top: 15px;
}

.meta-item {
  display: flex;
  flex-direction: column;
}

.meta-label {
  font-size: 11px;
  color: #8b8f8c;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.meta-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f221f;
}

.items-section {
  padding: 0 40px;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  table-layout: fixed;
}

.items-table th {
  padding: 12px 10px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #375b6d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #375b6d;
}

.items-table td {
  padding: 12px 10px;
  border-bottom: 1px solid #e9ecef;
  font-size: 13px;
  vertical-align: top;
}

.items-table tr:last-child td {
  border-bottom: none;
}

.totals-section {
  padding: 20px 40px;
  border-top: 2px solid #e9ecef;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 14px;
}

.total-row.final {
  border-top: 2px solid #dee2e6;
  margin-top: 10px;
  padding-top: 15px;
  font-size: 18px;
  font-weight: 700;
  color: #375b6d;
}

.payment-section {
  padding: 30px 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  border-top: 1px solid #e0e0e0;
}

.bank-details h4, .signature-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #375b6d;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.bank-info {
  font-size: 12px;
  line-height: 2;
}

.signature-area {
  text-align: center;
  margin-top: 20px;
}

.signature-img {
  height: 50px;
  margin-bottom: 10px;
  opacity: 0.8;
}

.stamp-img {
  height: 80px;
  margin-top: 10px;
  opacity: 0.9;
}

.signature-line {
  border-top: 1px solid #1f221f;
  width: 200px;
  margin: 0 auto 10px;
}

.footer {
  background: #375b6d;
  padding: 20px 40px;
  text-align: center;
  color: white;
  font-size: 11px;
}

.footer p {
  margin: 4px 0;
  opacity: 0.8;
}

.amount {
  text-align: right;
  font-weight: 600;
}

.text-right {
  text-align: right;
}

.text-center {
  text-align: center;
}
    </style>
    </head>
    <body>
      <div class="invoice-container">
        <!-- Header -->
        <div class="header">
          <div class="company-info">
            <h1>MERZAAI</h1>
            <div class="tagline">Intelligent Business Solutions</div>
          </div>
          <div class="logo">
            <img src="${logoUrl}" alt="Merzaai Logo" onerror="console.log('Logo image failed to load')">
          </div>
        </div>
        
        <!-- Invoice Title -->
        <div class="invoice-title">
          COMMERCIAL INVOICE
        </div>
        
        <!-- Details Section -->
        <div class="details-section">
          <div class="from-to">
            <h3>FROM</h3>
            <div class="address-block">
              <strong>MERZAAI </strong>
              Dubai Silicon Oasis<br>
              Dubai, United Arab Emirates<br>
              <strong>TRN:</strong> 123456789012345<br>
              <strong>Phone:</strong> +971 4 123 4567<br>
              <strong>Email:</strong> invoices@merzaai.com
            </div>
          </div>
          
          <div class="from-to">
            <h3>BILL TO</h3>
            <div class="address-block">
              <strong>${isCustom ? customInvoiceData.companyName : customer?.company}</strong>
              ${isCustom ? customInvoiceData.contactPerson : customer?.name}<br>
              ${isCustom ? customInvoiceData.address : customer?.address}<br>
              <strong>TRN:</strong> ${isCustom ? (customInvoiceData.trnNumber || 'N/A') : (customer?.trn || 'N/A')}<br>
              <strong>Phone:</strong> ${isCustom ? customInvoiceData.phone : customer?.phone}<br>
              <strong>Email:</strong> ${isCustom ? customInvoiceData.email : customer?.email}
            </div>
          </div>
        </div>
        
        <!-- Invoice Meta - 3 in one row -->
        <div class="details-section">
          <div class="invoice-meta" style="grid-column: 1 / -1;">
            <h3>INVOICE DETAILS</h3>
            <div class="meta-grid">
              <div class="meta-item">
                <span class="meta-label">Invoice Number</span>
                <span class="meta-value">${invoiceNumber}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Invoice Date</span>
                <span class="meta-value">${formData.date}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Due Date</span>
                <span class="meta-value">${formData.dueDate}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Currency</span>
                <span class="meta-value">AED</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Payment Terms</span>
                <span class="meta-value">Net 30 Days</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Reference</span>
                <span class="meta-value">${invoiceNumber}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Items Section -->
        <div class="items-section">
         <table class="items-table">
  <thead>
    <tr>
      <th style="text-align: left; width: 45%;">Item</th>
      <th style="text-align: right; width: 20%;">Unit Price</th>
      <th style="text-align: center; width: 15%;">Qty</th>
      <th style="text-align: right; width: 20%;">Amount</th>
    </tr>
  </thead>
  <tbody>
    ${formData.items.map(item => `
      <tr>
        <td style="text-align: left; width: 45%; padding: 12px 10px;">${item.description || 'Service'}</td>
        <td style="text-align: right; width: 20%; padding: 12px 10px;">AED ${parseFloat(item.price || 0).toFixed(2)}</td>
        <td style="text-align: center; width: 15%; padding: 12px 10px;">${item.quantity || 1}</td>
        <td style="text-align: right; width: 20%; padding: 12px 10px;">AED ${parseFloat(item.amount || 0).toFixed(2)}</td>
      </tr>
    `).join('')}
  </tbody>
</table>
        </div>
        
        <!-- Totals Section -->
        <div class="totals-section">
          <div class="total-row">
            <span>Gross Amount:</span>
            <span class="amount">AED ${subtotal.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>VAT (5%):</span>
            <span class="amount">AED ${vat.toFixed(2)}</span>
          </div>
          <div class="total-row final">
            <span>Total Amount Due:</span>
            <span class="amount">AED ${total.toFixed(2)}</span>
          </div>
        </div>
        
        <!-- Payment & Signature Section -->
        <div class="payment-section">
          <div class="bank-details">
            <h4>Bank Transfer Details</h4>
            <div class="bank-info">
              <strong>Account Name:</strong> MERZAAI FZCO<br>
              <strong>Account Number:</strong> 1234 5678 9012<br>
              <strong>IBAN:</strong> AE07 0331 2345 6789 0123 456<br>
              <strong>Bank Name:</strong> Emirates NBD<br>
              <strong>Swift Code:</strong> EBILAEAD<br>
              <strong>Payment Reference:</strong> ${invoiceNumber}
            </div>
          </div>
          
          <div class="signature-section">
            <h4>Authorized Signature</h4>
            <div class="signature-area">
              <img src="${signatureUrl}" alt="Authorized Signature" class="signature-img" onerror="console.log('Signature image failed to load')">
              <div class="signature-line"></div>
              <div style="font-size: 11px; margin-bottom: 15px;">Authorized Signatory</div>
              
              <img src="${stampUrl}" alt="Company Stamp" class="stamp-img" onerror="console.log('Stamp image failed to load')">
              <div style="font-size: 11px;">Company Stamp</div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <p>Thank you for your business with MERZAAI</p>
          <p>Payment due within 30 days.</p>
          <p>For inquiries: accounts@merzaai.com | +971 4 123 4567 | merzaai.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  console.log('Generating PDF...');
  
  // Generate PDF with better options for images
  const element = document.createElement('div');
  element.innerHTML = invoiceHTML;
  
  const opt = {
    margin: 10,
    filename: `${invoiceNumber}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true, // Enable CORS for external images
      logging: true, // Enable logging to see what's happening
      allowTaint: true, // Allow cross-origin images
      onclone: (clonedDoc) => {
        console.log('Document cloned for PDF generation');
        // Check if images are loaded in the cloned document
        const images = clonedDoc.querySelectorAll('img');
        images.forEach((img, index) => {
          console.log(`Image ${index}:`, img.src, 'complete:', img.complete, 'naturalWidth:', img.naturalWidth);
        });
      }
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf()
    .set(opt)
    .from(element)
    .save()
    .then(() => {
      console.log('PDF generated successfully');
    })
    .catch((error) => {
      console.error('PDF generation failed:', error);
    });
};



  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate required fields
  if (!formData.customer || !formData.date || !formData.dueDate) {
    alert('Please fill in all required fields');
    return;
  }

  // Validate line items
  const hasEmptyItems = formData.items.some(item => !item.description.trim() || !item.quantity || !item.price);
  if (hasEmptyItems) {
    alert('Please fill in all line items (description, quantity, and price)');
    return;
  }

  const { subtotal, vat, total } = calculateTotals();
  
  // Get customer details
  const selectedCustomer = customers.find(c => c.id == formData.customer);
  if (!selectedCustomer) {
    alert('Selected customer not found');
    return;
  }

  const invoiceData = {
    customer_id: formData.customer, // Send customer ID
    customer_name: selectedCustomer.name, // Send customer name
    customer_company: selectedCustomer.company, // Send company name
    date: formData.date,
    due_date: formData.dueDate,
    status: formData.status,
    items: formData.items,
    subtotal: subtotal,
    vat: vat,
    total: total,
    number: `INV-${Date.now().toString().slice(-4)}`
  };

  console.log('Sending invoice data:', invoiceData);

  try {
    const response = await fetch(`${API_BASE_URL}/api/invoices/add/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoiceData),
    });
    
    if (response.ok) {
      const savedInvoice = await response.json();
      alert('Invoice created successfully!');
      onSave(savedInvoice);
      onClose();
    } else {
      const errorData = await response.json();
      console.error('Server error:', errorData);
      alert('Error creating invoice: ' + (errorData.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error creating invoice:', error);
    alert('Error creating invoice: ' + error.message);
  }
};

  const handleCustomInvoiceSubmit = async (e) => {
  e.preventDefault();
  
  // Validate required fields
  if (!customInvoiceData.companyName || !customInvoiceData.contactPerson) {
    alert('Please fill in company name and contact person');
    return;
  }

  // Validate line items
  const hasEmptyItems = formData.items.some(item => !item.description.trim() || !item.quantity || !item.price);
  if (hasEmptyItems) {
    alert('Please fill in all line items (description, quantity, and price)');
    return;
  }

  const { subtotal, vat, total } = calculateTotals();
  const invoiceData = {
    custom_details: customInvoiceData,
    add_as_customer: true, // Always add as customer when using "Save Customer" button
    date: formData.date,
    due_date: formData.dueDate,
    status: formData.status,
    items: formData.items,
    subtotal: subtotal,
    vat: vat,
    total: total
  };

  console.log('Sending custom invoice data:', invoiceData);

  try {
    const response = await fetch(`${API_BASE_URL}/api/invoices/add-custom/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoiceData),
    });
    
    if (response.ok) {
      const savedInvoice = await response.json();
      alert('Custom invoice created and customer added successfully!');
      onSave(savedInvoice);
      onClose();
    } else {
      const errorData = await response.json();
      console.error('Server error:', errorData);
      alert('Error creating custom invoice: ' + (errorData.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error creating custom invoice:', error);
    alert('Error creating custom invoice: ' + error.message);
  }
};

  const { subtotal, vat, total } = calculateTotals();

  return (
    <div className="modal-overlay active" onClick={onClose}>
  <div className="modal-content" onClick={(e) => e.stopPropagation()}>

    {/* 🔥 THEMED HEADER */}
    <div className="modal-header ">
      <div className="modal-title-section">
        <h2 className="modal-title">
          {showCustomInvoice ? 'Create Custom Invoice' : 'Create New Invoice'}
        </h2>
        <p className="modal-subtitle">
          {showCustomInvoice ? 'Create invoice for a new customer' : 'Select existing customer and create invoice'}
        </p>
      </div>

      <button className="modal-close" onClick={onClose}>
        ×
      </button>
    </div>

    {/* Navigation Bar */}
    <div className="invoice-type-nav" >
      <div className="modern-section-headings" style={{ marginBottom: '0' }}>
        <button
          type="button"
          className={`modern-section-btn ${!showCustomInvoice ? 'active' : ''}`}
          onClick={() => setShowCustomInvoice(false)}
        >
          <div className="section-icon-wrapper">
            <i className="fas fa-users"></i>
          </div>
          <span className="section-label">Customer Invoice</span>
        </button>
        <button
          type="button"
          className={`modern-section-btn ${showCustomInvoice ? 'active' : ''}`}
          onClick={() => setShowCustomInvoice(true)}
        >
          <div className="section-icon-wrapper">
            <i className="fas fa-user-plus"></i>
          </div>
          <span className="section-label">Custom Invoice</span>
        </button>
      </div>
    </div>

    {/* BODY */}
    <div className="invoice-modal-body">
      {showCustomInvoice ? (
        // Custom Invoice Form
        <form onSubmit={handleCustomInvoiceSubmit}>

         <div className="modal-form-section">
                <h4>Custom Invoice</h4>
          <div className="form-group">
            <label>Company Name *</label>
            <input
              type="text"
              name="companyName"
              className="form-control"
              value={customInvoiceData.companyName}
              onChange={handleCustomInvoiceChange}
              placeholder="Enter company name"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Contact Person *</label>
              <input
                type="text"
                name="contactPerson"
                className="form-control"
                value={customInvoiceData.contactPerson}
                onChange={handleCustomInvoiceChange}
                placeholder="Contact person name"
                required
              />
            </div>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={customInvoiceData.title}
                onChange={handleCustomInvoiceChange}
                placeholder="Job title/position"
              />
            </div>
            <div className="form-group">
              <label>TRN Number</label>
              <input
                type="text"
                name="trnNumber"
                className="form-control"
                value={customInvoiceData.trnNumber}
                onChange={handleCustomInvoiceChange}
                placeholder="Tax Registration Number"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={customInvoiceData.email}
                onChange={handleCustomInvoiceChange}
                placeholder="email@company.com"
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                value={customInvoiceData.phone}
                onChange={handleCustomInvoiceChange}
                placeholder="+971 XX XXX XXXX"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              className="form-control"
              value={customInvoiceData.address}
              onChange={handleCustomInvoiceChange}
              placeholder="Full company address"
              rows="3"
            />
          </div>

          {/* Line Items Section */}
          <InvoiceLineItems 
            formData={formData}
            handleItemChange={handleItemChange}
            addLineItem={addLineItem}
            removeLineItem={removeLineItem}
          />

          <div className="form-row">
            <div className="form-group">
              <label>Invoice Date *</label>
              <input
                type="date"
                name="date"
                className="form-control"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Due Date *</label>
              <input
                type="date"
                name="dueDate"
                className="form-control"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" className="form-control" value={formData.status} onChange={handleChange}>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          </div>
        </form>
      ) : (
        // Regular Customer Invoice Form
        <form onSubmit={handleSubmit}>

                 <div className="modal-form-section">
                <h4>Customer Invoice</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Customer *</label>
              <select 
                name="customer" 
                className="form-control" 
                value={formData.customer} 
                onChange={handleChange}
                required
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.company} - {customer.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Invoice Number</label>
              <input 
                type="text" 
                className="form-control" 
                value={`INV-${Date.now().toString().slice(-4)}`} 
                readOnly 
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Invoice Date *</label>
              <input
                type="date"
                name="date"
                className="form-control"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Due Date *</label>
              <input
                type="date"
                name="dueDate"
                className="form-control"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Line Items Section */}
          <InvoiceLineItems 
            formData={formData}
            handleItemChange={handleItemChange}
            addLineItem={addLineItem}
            removeLineItem={removeLineItem}
          />

          <div className="form-group">
            <label>Status</label>
            <select name="status" className="form-control" value={formData.status} onChange={handleChange}>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          </div>
        </form>
      )}

      {/* Accounting Entry Section */}
      <div className="accounting-entry">
        <h4>Accounting Entry (Accrual Basis)</h4>
        <table className="entry-table">
          <thead>
            <tr>
              <th>Account</th>
              <th>Debit (AED)</th>
              <th>Credit (AED)</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Accounts Receivable</td>
              <td>{total.toFixed(2)}</td>
              <td></td>
              <td>Record sale to customer</td>
            </tr>
            <tr>
              <td>Sales Revenue</td>
              <td></td>
              <td>{subtotal.toFixed(2)}</td>
              <td>Record sale to customer</td>
            </tr>
            <tr>
              <td>Output VAT Payable</td>
              <td></td>
              <td>{vat.toFixed(2)}</td>
              <td>Record VAT liability</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* 🔥 NEW THEMED FOOTER */}
    <div className="modal-footer">
      <button className="modal-btn secondary" onClick={onClose}>
        Cancel
      </button>
      <button 
        className="modal-btn" 
        onClick={showCustomInvoice ? handleCustomInvoiceSubmit : handleSubmit}
      >
        {showCustomInvoice ? 'Save Customer' : 'Save Invoice'}
      </button>
      <button 
        className="modal-btn secondary" 
        onClick={() => generatePDF(showCustomInvoice)}
      >
        <i className="fas fa-download"></i> Download PDF
      </button>
    </div>

  </div>
</div>
  );
};

// Line Items Component
const InvoiceLineItems = ({ formData, handleItemChange, addLineItem, removeLineItem }) => {
  const calculateTotals = () => {
    if (!formData.items || !Array.isArray(formData.items)) {
      return { subtotal: 0, vat: 0, total: 0 };
    }
    
    const subtotal = formData.items.reduce((sum, item) => {
      return sum + (parseFloat(item.amount) || 0);
    }, 0);
    
    const vat = subtotal * 0.05;
    const total = subtotal + vat;
    
    return { subtotal, vat, total };
  };

  const { subtotal, vat, total } = calculateTotals();

  return (
    <>
      <div className="form-group">
        <label>Line Items</label>
        <table className="line-items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price (AED)</th>
              <th>Amount (AED)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {formData.items && formData.items.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    placeholder="Item description"
                    className="line-description"
                    value={item.description || ''}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    required
                  />
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="1"
                    className="line-quantity"
                    value={item.quantity || 1}
                    min="1"
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    required
                  />
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="line-price"
                    step="0.01"
                    min="0"
                    value={item.price || 0}
                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                    required
                  />
                </td>
                <td className="line-amount">{(item.amount || 0).toFixed(2)}</td>
                <td>
                  {formData.items.length > 1 && (
                    <button 
                      type="button" 
                      className="remove-line"
                      onClick={() => removeLineItem(index)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="btn btn-outline" onClick={addLineItem}>
          <i className="fas fa-plus"></i> Add Item
        </button>
      </div>

      <div className="totals-section">
        <div className="total-row">
          <span>Subtotal:</span>
          <span>AED {subtotal.toFixed(2)}</span>
        </div>
        <div className="total-row">
          <span>VAT (5%):</span>
          <span>AED {vat.toFixed(2)}</span>
        </div>
        <div className="total-row final">
          <span>Total:</span>
          <span>AED {total.toFixed(2)}</span>
        </div>
      </div>
    </>
  );
};

export default AddInvoiceModal;