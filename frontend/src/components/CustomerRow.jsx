import React, { useState } from "react";
import ViewEditCustomerModal from "./ViewEditCustomerModal";

const CustomerRow = ({ customer, onCustomerDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("view");

  const handleAction = async (action) => {
    if (action === "view" || action === "edit") {
      setModalType(action);
      setShowModal(true);
    } else if (action === "invoice") {
      alert("Create invoice for customer!");
    } else if (action === "delete") {
      if (confirm("Are you sure you want to delete this customer?")) {
        onCustomerDelete(customer.id);
      }
    }
  };

  const formatId = (id) => {
    return `CS-${String(id).padStart(4, '0')}`;
  };

  return (
    <>
      <tr>
        <td>
          <div className="lead-id">{formatId(customer.id)}</div>
        </td>
        <td>
          <div className="customer-name">{customer.name}</div>
          <div className="company-name">{customer.company}</div>
        </td>
        <td>{customer.company}</td>
        <td className="contact-info">
          <div className="contact-email">{customer.email}</div>
          <div className="contact-phone">{customer.phone}</div>
        </td>
        <td>
          <span className="status-badge status-new">
            {customer.totalInvoices} 
          </span>
        </td>
        <td>
          <span className="status-badge status-won">
            AED {Number(customer.totalAmount || "0").toLocaleString()}
          </span>
        </td>

        <td>
          <div className="action-buttons">
            <button
              className="action-btn view"
              onClick={() => handleAction("view")}
            >
              <i className="fas fa-eye"></i> 
            </button>
            <button
              className="action-btn edit"
              onClick={() => handleAction("edit")}
            >
              <i className="fas fa-edit"></i> 
            </button>
            <button
              className="action-btn delete"
              onClick={() => handleAction("delete")}
            >
              <i className="fas fa-trash"></i> 
            </button>
          </div>
        </td>
      </tr>

      {showModal && (
        <ViewEditCustomerModal
          customer={customer}
          type={modalType}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default CustomerRow;