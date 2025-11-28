import React, { useState } from 'react';
import InventoryRow from '../components/InventoryRow';
import AddInventoryModal from '../components/AddInventoryModal';
import UniversalTableHeader from './UniversalTableHeader';

const InventoryManagementTable = () => {
  const [inventory, setInventory] = useState([
    {
      id: 1,
      itemCode: '101',
      itemName: 'Screws',
      costPrice: 25,
      sellingPrice: 35,
      openingQuantity: 40,
      minimumQuantity: 50,
      currentQuantity: 30
    },
    {
      id: 2,
      itemCode: '202',
      itemName: 'Bolts',
      costPrice: 16,
      sellingPrice: 22,
      openingQuantity: 10,
      minimumQuantity: 15,
      currentQuantity: 20
    },
    {
      id: 3,
      itemCode: '303',
      itemName: 'Nails',
      costPrice: 7,
      sellingPrice: 12,
      openingQuantity: 5,
      minimumQuantity: 15,
      currentQuantity: 10
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const handleInventoryDelete = (itemId) => {
    setInventory(inventory.filter(item => item.id !== itemId));
  };

  const addInventory = (newItem) => {
    setInventory([
      ...inventory,
      { 
        ...newItem, 
        id: Date.now(),
        currentQuantity: newItem.openingQuantity
      }
    ]);
    setShowAddModal(false);
  };

  // Calculate inventory statistics
  const inventoryStats = [
    { value: inventory.length, label: 'Total Items' },
    { value: inventory.filter(item => item.currentQuantity <= item.minimumQuantity).length, label: 'Low Stock' },
    { value: inventory.reduce((sum, item) => sum + item.currentQuantity, 0), label: 'Total Quantity' },
    { value: `AED ${inventory.reduce((sum, item) => sum + (item.costPrice * item.currentQuantity), 0).toLocaleString()}`, label: 'Inventory Value' }
  ];

  const handleExport = () => {
    console.log('Export inventory clicked');
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Inventory Management</h1>
          <p className="page-subtitle">Manage product inventory, stock levels, and pricing</p>
        </div>
        <button className="page-header-btn" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus"></i> Add New Item
        </button>
      </div>

      <div className="data-table-container">
        <UniversalTableHeader
          stats={inventoryStats}
          onExport={handleExport}
        />

        <table className="data-table">
          <thead>
            <tr>
              <th>Item Code</th>
              <th>Item Name</th>
              <th>Cost Price</th>
              <th>Selling Price</th>
              <th>Opening Qty</th>
              <th>Minimum Qty</th>
              <th>Current Qty</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <InventoryRow
                key={item.id}
                item={item}
                onInventoryDelete={handleInventoryDelete}
              />
            ))}
          </tbody>
        </table>

        {inventory.length === 0 && (
          <div className="data-empty-state">
            <i className="fas fa-boxes data-empty-icon"></i>
            <h3>No Inventory Items</h3>
            <p>Get started by adding your first inventory item</p>
            <div className="data-empty-actions">
              <button className="btn" onClick={() => setShowAddModal(true)}>
                <i className="fas fa-plus"></i>
                Add Item
              </button>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddInventoryModal
          onClose={() => setShowAddModal(false)}
          onSave={addInventory}
        />
      )}
    </>
  );
};

export default InventoryManagementTable;
