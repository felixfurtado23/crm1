import React, { useState } from 'react';
import VendorRow from './VendorRow';
import AddVendorModal from './AddVendorModal.jsx';
import UniversalTableHeader from './UniversalTableHeader';

const VendorsTable = () => {
  // Hardcoded vendor list
  const [vendors, setVendors] = useState([
    {
      id: 1,
      name: "John Doe",
      company: "Doe Supplies",
      email: "john@doe.com",
      phone: "+91 98765 12345",
      address: "Bangalore, India",
      totalBills: 5,
      totalAmount: 1200,
    },
    {
      id: 2,
      name: "Arjun Mehta",
      company: "Mehta Traders",
      email: "arjun@mehta.com",
      phone: "+91 99888 77665",
      address: "Mumbai, India",
      totalBills: 8,
      totalAmount: 2500,
    },
    {
      id: 3,
      name: "Priya Singh",
      company: "Singh Industries",
      email: "priya@singh.com",
      phone: "+91 91234 56789",
      address: "Delhi, India",
      totalBills: 3,
      totalAmount: 900,
    },
    {
      id: 4,
      name: "Rahul Sharma",
      company: "Sharma Enterprises",
      email: "rahul@sharma.com",
      phone: "+91 92345 67890",
      address: "Chennai, India",
      totalBills: 6,
      totalAmount: 1800,
    },
    {
      id: 5,
      name: "Sneha Kapoor",
      company: "Kapoor & Co.",
      email: "sneha@kapoor.com",
      phone: "+91 93456 78901",
      address: "Pune, India",
      totalBills: 4,
      totalAmount: 1500,
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const handleVendorDelete = (vendorId) => {
    setVendors(vendors.filter(v => v.id !== vendorId));
  };

  const addVendor = (newVendor) => {
    setVendors([
      ...vendors,
      { ...newVendor, id: Date.now(), totalBills: 0, totalAmount: 0 }
    ]);
    setShowAddModal(false);
  };

  // Calculate vendor statistics
  const vendorStats = [
    { value: vendors.length, label: 'Total Vendors' },
    { value: vendors.reduce((sum, vendor) => sum + vendor.totalBills, 0), label: 'Total Bills' },
    { value: `AED ${vendors.reduce((sum, vendor) => sum + vendor.totalAmount, 0).toLocaleString()}`, label: 'Total Amount' },
    { value: vendors.filter(v => v.totalBills > 0).length, label: 'Active Vendors' }
  ];

  const handleExport = () => {
    // Export logic here
    console.log('Export vendors clicked');
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Vendor Management</h1>
          <p className="page-subtitle">Manage vendor relationships and track supplier information</p>
        </div>
        <button className="page-header-btn" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus"></i> Add New Vendor
        </button>
      </div>
    
      <div className="data-table-container">
        <UniversalTableHeader
          stats={vendorStats}
          onExport={handleExport}
        />

        <table className="data-table">
          <thead>
            <tr>
              <th>Vendor ID</th>
              <th>Vendor Name</th>
              <th>Company</th>
              <th>Contact Info</th>
              <th>Total Bills</th>
              <th>Total Amount</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {vendors.map(vendor => (
              <VendorRow
                key={vendor.id}
                vendor={vendor}
                onVendorDelete={handleVendorDelete}
              />
            ))}
          </tbody>
        </table>

        {vendors.length === 0 && (
          <div className="data-empty-state">
            <i className="fas fa-truck data-empty-icon"></i>
            <h3>No Vendors Found</h3>
            <p>Get started by adding your first vendor</p>
            <div className="data-empty-actions">
              <button className="btn" onClick={() => setShowAddModal(true)}>
                <i className="fas fa-plus"></i>
                Add Vendor
              </button>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddVendorModal
          onClose={() => setShowAddModal(false)}
          onSave={addVendor}
        />
      )}
    </>
  );
};

export default VendorsTable;