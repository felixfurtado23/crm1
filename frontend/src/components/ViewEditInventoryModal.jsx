import React, { useState, useEffect } from 'react';

const ViewEditInventoryModal = ({ item, type, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({});
  const isEdit = type === 'edit';

  useEffect(() => {
    setFormData({
      itemCode: item.itemCode || '',
      itemName: item.itemName || '',
      costPrice: item.costPrice || '',
      sellingPrice: item.sellingPrice || '',
      openingQuantity: item.openingQuantity || '',
      minimumQuantity: item.minimumQuantity || '',
      currentQuantity: item.currentQuantity || ''
    });
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      ...item,
      ...formData,
      costPrice: parseFloat(formData.costPrice) || 0,
      sellingPrice: parseFloat(formData.sellingPrice) || 0,
      openingQuantity: parseInt(formData.openingQuantity) || 0,
      minimumQuantity: parseInt(formData.minimumQuantity) || 0,
      currentQuantity: parseInt(formData.currentQuantity) || 0
    });
    onClose();
  };

  const getStockStatus = (currentQty, minQty) => {
    if (currentQty === 0) return 'Out of Stock';
    if (currentQty <= minQty) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">{isEdit ? 'Edit' : 'View'} Inventory Item</h2>
            <p className="modal-subtitle">
              {isEdit ? 'Update the inventory item details' : 'View inventory item information'}
            </p>
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
                  <label>Item Code</label>
                  <input
                    type="text"
                    name="itemCode"
                    className="form-control"
                    value={formData.itemCode || ''}
                    onChange={handleChange}
                    disabled={!isEdit}
                  />
                </div>

                <div className="form-group">
                  <label>Item Name</label>
                  <input
                    type="text"
                    name="itemName"
                    className="form-control"
                    value={formData.itemName || ''}
                    onChange={handleChange}
                    disabled={!isEdit}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Cost Price (AED)</label>
                  <input
                    type="number"
                    name="costPrice"
                    className="form-control"
                    value={formData.costPrice || ''}
                    onChange={handleChange}
                    disabled={!isEdit}
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Selling Price (AED)</label>
                  <input
                    type="number"
                    name="sellingPrice"
                    className="form-control"
                    value={formData.sellingPrice || ''}
                    onChange={handleChange}
                    disabled={!isEdit}
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
                    value={formData.openingQuantity || ''}
                    onChange={handleChange}
                    disabled={!isEdit}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Minimum Quantity</label>
                  <input
                    type="number"
                    name="minimumQuantity"
                    className="form-control"
                    value={formData.minimumQuantity || ''}
                    onChange={handleChange}
                    disabled={!isEdit}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Current Quantity</label>
                  <input
                    type="number"
                    name="currentQuantity"
                    className="form-control"
                    value={formData.currentQuantity || ''}
                    onChange={handleChange}
                    disabled={!isEdit}
                    min="0"
                  />
                </div>

                {!isEdit && (
                  <div className="form-group">
                    <label>Stock Status</label>
                    <div className="status-display">
                      {getStockStatus(item.currentQuantity, item.minimumQuantity)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="modal-btn secondary" onClick={onClose}>
            {isEdit ? 'Cancel' : 'Close'}
          </button>
          {isEdit && (
            <button className="modal-btn" onClick={handleSubmit}>
              Update Item
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default ViewEditInventoryModal;