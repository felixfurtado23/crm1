import React, { useState } from "react";
import ViewEditCustomerModal from "./ViewEditCustomerModal";

const CustomerRow = ({ customer }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("view");
  const API_BASE_URL = 'http://localhost:8000';

  const handleAction = async (action) => {
    if (action === "view" || action === "edit") {
      setModalType(action);
      setShowModal(true);
    } else if (action === "invoice") {
      alert("Create invoice for customer!");
    } else if (action === "delete") {
      if (confirm("Are you sure you want to delete this customer?")) {
        await deleteCustomer();
      }
    }
  };

  const deleteCustomer = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customers/${customer.id}/delete/`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        alert('Customer deleted successfully!');
        window.location.reload();
      } else {
        alert('Error deleting customer');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Error deleting customer');
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
            {/* Aed {customer.totalAmount || "0".toLocaleString()} */}
            Aed{Number (customer.totalAmount || "0").toLocaleString()}
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