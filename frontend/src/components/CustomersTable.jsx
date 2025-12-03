import React, { useState, useEffect } from 'react';
import CustomerRow from './CustomerRow';
import AddCustomerModal from './AddCustomerModal';
import UniversalTableHeader from './UniversalTableHeader';

const CustomersTable = () => {
  const [customers, setCustomers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Hardcoded customer data
  const hardcodedCustomers = [
    {
      id: 1,
      name: "Ahmed Al Mansoori",
      company: "Alpha Trading LLC",
      email: "ahmed@alphatrading.ae",
      phone: "+971 50 123 4567",
      totalInvoices: 12,
      totalAmount: 1850000,
      status: "Active",
      address: "Business Bay, Dubai, UAE",
      contactPerson: "Ahmed Al Mansoori",
      website: "www.alphatrading.ae",
      registrationDate: "2023-03-15"
    },
    {
      id: 2,
      name: "Fatima Al Zaabi",
      company: "Beta Constructions",
      email: "fatima@betaconstructions.com",
      phone: "+971 56 234 5678",
      totalInvoices: 8,
      totalAmount: 2750000,
      status: "Active",
      address: "Sheikh Zayed Road, Dubai, UAE",
      contactPerson: "Fatima Al Zaabi",
      website: "www.betaconstructions.com",
      registrationDate: "2023-05-22"
    },
    {
      id: 3,
      name: "Mohammed Al Shamsi",
      company: "Gamma Solutions FZ",
      email: "mohammed@gammasolutions.ae",
      phone: "+971 52 345 6789",
      totalInvoices: 5,
      totalAmount: 425000,
      status: "Active",
      address: "Dubai Internet City, UAE",
      contactPerson: "Mohammed Al Shamsi",
      website: "www.gammasolutions.ae",
      registrationDate: "2023-08-10"
    },
    {
      id: 4,
      name: "Layla Al Qubaisi",
      company: "Delta Retail Group",
      email: "layla@deltaretail.com",
      phone: "+971 55 456 7890",
      totalInvoices: 15,
      totalAmount: 1250000,
      status: "Active",
      address: "Mirdif City Centre, Dubai, UAE",
      contactPerson: "Layla Al Qubaisi",
      website: "www.deltaretail.com",
      registrationDate: "2023-01-30"
    },
    {
      id: 5,
      name: "Omar Al Dhaheri",
      company: "Epsilon Services",
      email: "omar@epsilonservices.ae",
      phone: "+971 54 567 8901",
      totalInvoices: 3,
      totalAmount: 675000,
      status: "Active",
      address: "Al Nahda, Sharjah, UAE",
      contactPerson: "Omar Al Dhaheri",
      website: "www.epsilonservices.ae",
      registrationDate: "2023-11-05"
    },
    {
      id: 6,
      name: "Aisha Al Hameli",
      company: "Zeta Technologies",
      email: "aisha@zetatech.com",
      phone: "+971 58 678 9012",
      totalInvoices: 7,
      totalAmount: 985000,
      status: "Active",
      address: "Abu Dhabi Global Market, UAE",
      contactPerson: "Aisha Al Hameli",
      website: "www.zetatech.com",
      registrationDate: "2023-07-18"
    },
    {
      id: 7,
      name: "Khalid Al Marzooqi",
      company: "Eta Manufacturing",
      email: "khalid@etamanufacturing.ae",
      phone: "+971 52 789 0123",
      totalInvoices: 10,
      totalAmount: 2250000,
      status: "Active",
      address: "Industrial City, Abu Dhabi, UAE",
      contactPerson: "Khalid Al Marzooqi",
      website: "www.etamanufacturing.ae",
      registrationDate: "2023-04-12"
    },
    {
      id: 8,
      name: "Noor Al Suwaidi",
      company: "Theta Logistics",
      email: "noor@thetalogistics.com",
      phone: "+971 50 890 1234",
      totalInvoices: 6,
      totalAmount: 850000,
      status: "Active",
      address: "Jebel Ali Free Zone, Dubai, UAE",
      contactPerson: "Noor Al Suwaidi",
      website: "www.thetalogistics.com",
      registrationDate: "2023-09-25"
    }
  ];

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setCustomers(hardcodedCustomers);
      setLoading(false);
    }, 500);
  }, []);

  const handleCustomerDelete = (customerId) => {
    setCustomers(customers.filter(customer => customer.id !== customerId));
  };

  const addCustomer = (newCustomer) => {
    setCustomers([...customers, { 
      ...newCustomer, 
      id: customers.length + 1,
      totalInvoices: 0,
      totalAmount: 0,
      status: "Active"
    }]);
    setShowAddModal(false);
  };

  // Calculate customer statistics
  const totalInvoices = customers.reduce((sum, customer) => sum + (customer.totalInvoices || 0), 0);
  const totalRevenue = customers.reduce((sum, customer) => sum + (customer.totalAmount || 0), 0);
  
  const customerStats = [
    { value: customers.length, label: 'Total Customers' },
    { value: customers.filter(c => c.status === 'Active').length, label: 'Active' },
    { value: totalInvoices, label: 'Total Invoices' },
    { 
      value: `AED ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, 
      label: 'Total Revenue' 
    }
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