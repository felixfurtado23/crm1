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

  // Helper function to format numbers with commas
  const formatNumber = (value) => {
    if (value === '' || value === null || value === undefined) return '';
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    return num.toLocaleString();
  };

  // Helper function to format integers with commas (no decimals)
  const formatInteger = (value) => {
    if (value === '' || value === null || value === undefined) return '';
    const int = parseInt(value);
    if (isNaN(int)) return '';
    return int.toLocaleString('en-US');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'costPrice' || name === 'sellingPrice') {
      // For price fields, clean the input
      let cleanedValue = value;
      
      // Remove any non-numeric characters except decimal point
      cleanedValue = cleanedValue.replace(/[^\d.]/g, '');
      
      // Ensure only one decimal point
      const decimalCount = cleanedValue.split('.').length - 1;
      if (decimalCount > 1) {
        cleanedValue = cleanedValue.substring(0, cleanedValue.lastIndexOf('.'));
      }
      
      // Limit to 2 decimal places
      if (cleanedValue.includes('.')) {
        const parts = cleanedValue.split('.');
        if (parts[1].length > 2) {
          cleanedValue = parts[0] + '.' + parts[1].substring(0, 2);
        }
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: cleanedValue
      }));
    } else if (name === 'openingQuantity' || name === 'minimumQuantity') {
      // For quantity fields, ensure it's a positive integer
      const intValue = parseInt(value) || 0;
      setFormData(prev => ({
        ...prev,
        [name]: intValue >= 0 ? intValue : 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>

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
                    style={{ textAlign: 'left', direction: 'ltr' }}
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
                    style={{ textAlign: 'left', direction: 'ltr' }}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Cost Price (AED)</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      name="costPrice"
                      className="form-control"
                      value={formatNumber(formData.costPrice)}
                      onChange={handleChange}
                      onFocus={(e) => {
                        e.target.value = formData.costPrice || '';
                      }}
                      onBlur={(e) => {
                        if (e.target.value) {
                          const num = parseFloat(e.target.value);
                          if (!isNaN(num)) {
                            e.target.value = formatNumber(num);
                          }
                        }
                      }}
                      placeholder="0.00"
                      style={{ 
                        textAlign: 'left', 
                        direction: 'ltr',
                        fontFamily: "'Courier New', monospace", 
                        fontWeight: '600',
                        paddingRight: '40px'
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#6b7280',
                      fontSize: '12px',
                      pointerEvents: 'none'
                    }}>
                      AED
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Selling Price (AED)</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      name="sellingPrice"
                      className="form-control"
                      value={formatNumber(formData.sellingPrice)}
                      onChange={handleChange}
                      onFocus={(e) => {
                        e.target.value = formData.sellingPrice || '';
                      }}
                      onBlur={(e) => {
                        if (e.target.value) {
                          const num = parseFloat(e.target.value);
                          if (!isNaN(num)) {
                            e.target.value = formatNumber(num);
                          }
                        }
                      }}
                      placeholder="0.00"
                      style={{ 
                        textAlign: 'left', 
                        direction: 'ltr',
                        fontFamily: "'Courier New', monospace", 
                        fontWeight: '600',
                        paddingRight: '40px'
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#6b7280',
                      fontSize: '12px',
                      pointerEvents: 'none'
                    }}>
                      AED
                    </span>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Opening Quantity</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      name="openingQuantity"
                      className="form-control"
                      value={formatInteger(formData.openingQuantity)}
                      onChange={handleChange}
                      onFocus={(e) => {
                        e.target.value = formData.openingQuantity || '';
                      }}
                      onBlur={(e) => {
                        if (e.target.value) {
                          const int = parseInt(e.target.value.replace(/,/g, ''));
                          if (!isNaN(int)) {
                            e.target.value = formatInteger(int);
                          }
                        }
                      }}
                      placeholder="0"
                      style={{ 
                        textAlign: 'left', 
                        direction: 'ltr',
                        fontFamily: "'Courier New', monospace", 
                        fontWeight: '600',
                        paddingRight: '40px'
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#6b7280',
                      fontSize: '12px',
                      pointerEvents: 'none'
                    }}>
                      units
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Minimum Quantity</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      name="minimumQuantity"
                      className="form-control"
                      value={formatInteger(formData.minimumQuantity)}
                      onChange={handleChange}
                      onFocus={(e) => {
                        e.target.value = formData.minimumQuantity || '';
                      }}
                      onBlur={(e) => {
                        if (e.target.value) {
                          const int = parseInt(e.target.value.replace(/,/g, ''));
                          if (!isNaN(int)) {
                            e.target.value = formatInteger(int);
                          }
                        }
                      }}
                      placeholder="0"
                      style={{ 
                        textAlign: 'left', 
                        direction: 'ltr',
                        fontFamily: "'Courier New', monospace", 
                        fontWeight: '600',
                        paddingRight: '40px'
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#6b7280',
                      fontSize: '12px',
                      pointerEvents: 'none'
                    }}>
                      units
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '16px', 
          padding: '20px 28px',
          background: '#f8fafc',
          borderTop: '1px solid #e9ecef',
          borderRadius: '0 0 16px 16px'
        }}>
          <button 
            className="modal-btn secondary" 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '2px solid #9ca3af',
              color: '#6b7280',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              minWidth: '120px',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#f8f9fa';
              e.target.style.borderColor = '#6b7280';
              e.target.style.color = '#4b5563';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.borderColor = '#9ca3af';
              e.target.style.color = '#6b7280';
            }}
          >
            Cancel
          </button>
          <button 
            className="modal-btn" 
            onClick={handleSubmit}
            style={{
              background: 'linear-gradient(135deg, var(--blue-2), var(--blue-1))',
              border: 'none',
              color: 'white',
              padding: '12px 28px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              minWidth: '140px',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #2a4452, #375b6d)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, var(--blue-2), var(--blue-1))';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Add Item
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddInventoryModal;