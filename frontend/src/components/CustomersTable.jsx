import React, { useState, useEffect } from 'react';
import CustomerRow from './CustomerRow';
import AddCustomerModal from './AddCustomerModal';
import UniversalTableHeader from './UniversalTableHeader';

const CustomersTable = () => {
  const [customers, setCustomers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = 'http://72.61.171.226:8000';

  const handleCustomerDelete = (customerId) => {
    setCustomers(customers.filter(customer => customer.id !== customerId));
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/customers/`);
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const addCustomer = (newCustomer) => {
    setCustomers([...customers, { ...newCustomer, id: Date.now() }]);
    setShowAddModal(false);
  };

  // Calculate customer statistics
  const customerStats = [
    { value: customers.length, label: 'Total Customers' },
    { value: customers.filter(c => c.status === 'Active' || c.totalInvoices > 0).length, label: 'Active' },
    { value: customers.reduce((sum, customer) => sum + (customer.totalInvoices || 0), 0), label: 'Total Invoices' },
    { value: `AED ${customers.reduce((sum, customer) => sum + (customer.totalAmount || 0), 0).toFixed(2)}`, label: 'Total Revenue' }
  ];

  const handleExport = () => {
    // Export logic here
    console.log('Export clicked');
  };

  if (loading) {
    return <div>Loading customers...</div>;
  }

  return (
    <>
      <div className="page-header">
        <div className="page-title-section">
          <div className="page-title">Customer Management</div>
          <p className="page-subtitle">Manage customer relationships and track business interactions</p>
        </div>
        <button className="page-header-btn" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus"></i> Add Customer
        </button>
      </div>

      <div className="data-table-container">
        <UniversalTableHeader
          stats={customerStats}
          onExport={handleExport}
        />

        <table className="data-table">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Customer Name</th>
              <th>Company</th>
              <th>Contact Info</th>
              <th>Total Invoices</th>
              <th>Total Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <CustomerRow 
                key={customer.id} 
                customer={customer} 
                onCustomerDelete={handleCustomerDelete}
              />
            ))}
          </tbody>
        </table>

        {customers.length === 0 && (
          <div className="data-empty-state">
            <i className="fas fa-users data-empty-icon"></i>
            <h3>No Customers Found</h3>
            <p>Get started by adding your first customer</p>
            <div className="data-empty-actions">
              <button className="btn" onClick={() => setShowAddModal(true)}>
                <i className="fas fa-plus"></i>
                Add Customer
              </button>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddCustomerModal 
          onClose={() => setShowAddModal(false)}
          onSave={addCustomer}
        />
      )}
    </>
  );
};

export default CustomersTable;