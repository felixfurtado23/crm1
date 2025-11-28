import React, { useState } from 'react';

const AddInventoryModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    itemCode: '',
    itemName: '',
    costPrice: '',
    sellingPrice: '',
    openingQuantity: '',
    minimumQuantity: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.itemCode || !formData.itemName) {
      alert('Please fill in all required fields');
      return;
    }

    onSave({
      ...formData,
      costPrice: parseFloat(formData.costPrice) || 0,
      sellingPrice: parseFloat(formData.sellingPrice) || 0,
      openingQuantity: parseInt(formData.openingQuantity) || 0,
      minimumQuantity: parseInt(formData.minimumQuantity) || 0
    });
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">Add New Inventory Item</h2>
            <p className="modal-subtitle">Fill the details to add a new inventory item</p>
          </div>

          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="modal-form-section">
              <h4>Item Information</h4>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Item Code *</label>
                  <input
                    type="text"
                    name="itemCode"
                    className="form-control"
                    value={formData.itemCode}
                    onChange={handleChange}
                    placeholder="Enter unique item code"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Item Name *</label>
                  <input
                    type="text"
                    name="itemName"
                    className="form-control"
                    value={formData.itemName}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Cost Price ($)</label>
                  <input
                    type="number"
                    name="costPrice"
                    className="form-control"
                    value={formData.costPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Selling Price ($)</label>
                  <input
                    type="number"
                    name="sellingPrice"
                    className="form-control"
                    value={formData.sellingPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Opening Quantity</label>
                  <input
                    type="number"
                    name="openingQuantity"
                    className="form-control"
                    value={formData.openingQuantity}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Minimum Quantity</label>
                  <input
                    type="number"
                    name="minimumQuantity"
                    className="form-control"
                    value={formData.minimumQuantity}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="modal-btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-btn" onClick={handleSubmit}>
            Add Item
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddInventoryModal; 