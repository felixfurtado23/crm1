import React, { useState, useEffect } from "react";

const ViewEditInvoiceModal = ({ invoice, type, onClose }) => {
  const isView = type === "view";
  const [formData, setFormData] = useState({
    customer: "",
    date: "",
    dueDate: "",
    status: "draft",
    items: [],
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        customer: invoice.customer || "",
        date: invoice.date || "",
        dueDate: invoice.dueDate || "",
        status: invoice.status || "draft",
        items: invoice.items || [],
      });
    }
  }, [invoice]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Invoice updated successfully!");
    window.location.reload();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isView ? "Invoice Details" : "Edit Invoice"}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          {isView ? (
            <div>
            <div className="modal-form-section">
                <h4>Customer Information</h4>
              <div style={{ marginBottom: "24px" }}>
                <h3>Invoice {invoice.number}</h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                    marginTop: "16px",
                  }}
                >
                  <div>
                    <strong>Customer:</strong>
                    <br />
                    {invoice.customer}
                  </div>
                  <div>
                    <strong>Status:</strong>
                    <br />
                    <span className={`status-badge status-${invoice.status}`}>
                      {invoice.status.charAt(0).toUpperCase() +
                        invoice.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <strong>Invoice Date:</strong>
                    <br />
                    {invoice.date}
                  </div>
                  <div>
                    <strong>Due Date:</strong>
                    <br />
                    {invoice.dueDate}
                  </div>
                </div>
              </div>

              </div>


  <div className="modal-form-section">
                <h4>Items Table</h4>
              <table className="line-items-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>${parseFloat(item.price || 0).toFixed(2)}</td>
                      <td>${parseFloat(item.amount || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              </div>

              <div className="totals-section">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>${parseFloat(invoice.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>VAT (5%):</span>
                  <span>${parseFloat(invoice.vat || 0).toFixed(2)}</span>
                </div>
                <div className="total-row final">
                  <span>Total:</span>
                  <span>${parseFloat(invoice.total || 0).toFixed(2)}</span>
                </div>
              </div>
            

</div>

          ) : (
            <form onSubmit={handleSubmit}>
              {/* Edit form similar to AddInvoiceModal but with existing data */}
              <div className="form-row">
                <div className="form-group">
                  <label>Customer *</label>
                  <input
                    type="text"
                    name="customer"
                    className="form-control"
                    value={formData.customer}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Invoice Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={invoice.number}
                    readOnly
                  />
                </div>
              </div>

              {/* Add other edit fields as needed */}
            </form>
          )}
        </div>
        <div className="form-footer">
          <button className="btn btn-outline" onClick={onClose}>
            {isView ? "Close" : "Cancel"}
          </button>
          {!isView && (
            <button className="btn" onClick={handleSubmit}>
              Update Invoice
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewEditInvoiceModal;
