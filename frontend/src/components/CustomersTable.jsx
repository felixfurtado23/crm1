import React, { useState, useEffect } from 'react';
import CustomerRow from './CustomerRow';
import AddCustomerModal from './AddCustomerModal';

const CustomersTable = () => {
  const [customers, setCustomers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


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

  if (loading) {
    return <div>Loading customers...</div>;
  }

  return (
    <>
      <div className="data-table-container">
        <div className="page-header">
          <div className="page-title">Customer Management</div>
          <button className="btn" onClick={() => setShowAddModal(true)}>
            <i className="fas fa-plus"></i> Add New Customer
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
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