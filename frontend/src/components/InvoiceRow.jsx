import React, { useState } from 'react';
import ViewEditInvoiceModal from './ViewEditInvoiceModal';

const InvoiceRow = ({ invoice }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');
  const API_BASE_URL = 'http://72.61.171.226:8000';

  const getStatusClass = (status) => {
    const statusMap = {
      draft: 'status-draft',
      sent: 'status-sent', 
      pending: 'status-sent', // Map pending to sent style
      paid: 'status-paid',
      overdue: 'status-overdue'
    };
    return statusMap[status] || 'status-draft';
  };

  // Format customer display
  const formatCustomerDisplay = () => {
    // If it's a custom invoice with custom_details
    if (invoice.custom_details) {
      const { companyName, contactPerson } = invoice.custom_details;
      return `${companyName} - ${contactPerson}`;
    }
    
    // If it's a regular customer invoice with customer_company
    if (invoice.customer_company && invoice.customer) {
      // Extract name from the customer field (which might be "Company - Name")
      const customerParts = invoice.customer.split(' - ');
      if (customerParts.length === 2) {
        return `${invoice.customer_company} - ${customerParts[1]}`;
      }
      return `${invoice.customer_company} - ${invoice.customer}`;
    }
    
    // Fallback to the original customer field
    return invoice.customer;
  };

  const handleAction = async (action) => {
    if (action === 'view' || action === 'edit') {
      setModalType(action);
      setShowModal(true);
    } else if (action === 'mark-paid') {
      if (confirm('Mark this invoice as paid?')) {
        await markInvoiceAsPaid();
      }
    } else if (action === 'mark-sent') {
      if (confirm('Mark this invoice as sent?')) {
        await markInvoiceAsSent();
      }
    }
  };

  const markInvoiceAsPaid = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/invoices/${invoice.id}/mark-paid/`, {
        method: 'POST',
      });
      
      if (response.ok) {
        alert('Invoice marked as paid successfully!');
        window.location.reload();
      } else {
        alert('Error marking invoice as paid');
      }
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      alert('Error marking invoice as paid');
    }
  };

  const markInvoiceAsSent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/invoices/${invoice.id}/mark-sent/`, {
        method: 'POST',
      });
      
      if (response.ok) {
        alert('Invoice marked as sent successfully!');
        window.location.reload();
      } else {
        alert('Error marking invoice as sent');
      }
    } catch (error) {
      console.error('Error marking invoice as sent:', error);
      alert('Error marking invoice as sent');
    }
  };

  return (
    <>
      <tr>
          <td ><div className="lead-id">{invoice.number}</div>
        </td>
        <td>{formatCustomerDisplay()}</td>
        <td>{invoice.date}</td>
        <td>{invoice.dueDate}</td>
        <td>Aed {Number(invoice.total).toLocaleString()}</td>
        <td>
          <span className={`status-badge ${getStatusClass(invoice.status)}`}>
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </span>
        </td>
        <td>
          <div className="action-buttons">
            <button className="action-btn view" onClick={() => handleAction('view')}>
              <i className="fas fa-eye"></i> View
            </button>
            
            {invoice.status === 'draft' && (
              <button className="action-btn edit" onClick={() => handleAction('mark-sent')}>
                <i className="fas fa-paper-plane"></i> Send
              </button>
            )}
            
            {/* Show Paid button for both 'sent' AND 'pending' status */}
            {(invoice.status === 'sent' || invoice.status === 'pending') && (
              <button className="action-btn mark-paid" onClick={() => handleAction('mark-paid')}>
                <i className="fas fa-check"></i> Paid
              </button>
            )}
            
            {invoice.status === 'paid' && (
              <button className="action-btn edit" onClick={() => handleAction('edit')}>
                <i className="fas fa-edit"></i> Edit
              </button>
            )}
          </div>
        </td>
      </tr>

      {showModal && (
        <ViewEditInvoiceModal 
          invoice={invoice}
          type={modalType}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default InvoiceRow;