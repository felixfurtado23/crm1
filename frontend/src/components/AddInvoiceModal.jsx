import React, { useState, useEffect } from 'react';

const AddInvoiceModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    customer: '',
    date: '',
    dueDate: '',
    status: 'draft',
    items: [{ description: '', quantity: 1, price: 0, amount: 0 }]
  });

  const [customers, setCustomers] = useState([]);
  const API_BASE_URL = '';

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

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    // Calculate amount
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
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      items: newItems
    });
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const vat = subtotal * 0.05;
    const total = subtotal + vat;
    
    return { subtotal, vat, total };
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formData.customer || !formData.date || !formData.dueDate) {
    alert('Please fill in all required fields');
    return;
  }

  const { subtotal, vat, total } = calculateTotals();
  const invoiceData = {
    ...formData,
    customer_id: formData.customer, // Send as customer_id instead of customer
    subtotal,
    vat,
    total,
    number: `INV-${Date.now().toString().slice(-4)}`
  };

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
      window.location.reload();
    } else {
      alert('Error creating invoice');
    }
  } catch (error) {
    console.error('Error creating invoice:', error);
    alert('Error creating invoice');
  }
};

  const { subtotal, vat, total } = calculateTotals();

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Create New Invoice</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
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

            <div className="form-group">
              <label>Line Items</label>
              <table className="line-items-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          placeholder="Item description"
                          className="line-description"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          placeholder="1"
                          className="line-quantity"
                          value={item.quantity}
                          min="1"
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          placeholder="0.00"
                          className="line-price"
                          step="0.01"
                          min="0"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                        />
                      </td>
                      <td className="line-amount">${item.amount.toFixed(2)}</td>
                      <td>
                        <button 
                          type="button" 
                          className="remove-line"
                          onClick={() => removeLineItem(index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
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
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>VAT (5%):</span>
                <span>${vat.toFixed(2)}</span>
              </div>
              <div className="total-row final">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
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
          </form>

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
        <div className="form-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={handleSubmit}>Save Invoice</button>
        </div>
      </div>
    </div>
  );
};

export default AddInvoiceModal;