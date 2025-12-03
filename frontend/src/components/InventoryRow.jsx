import React, { useState } from 'react';
import ViewEditInventoryModal from './ViewEditInventoryModal';

const InventoryRow = ({ item, onInventoryDelete, onInventoryUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');

  const handleAction = (action) => {
    if (action === 'view' || action === 'edit') {
      setModalType(action);
      setShowModal(true);
    } else if (action === 'delete') {
      if (confirm('Are you sure you want to delete this inventory item?')) {
        onInventoryDelete(item.id);
      }
    }
  };

  const getStockStatus = (currentQty, minQty) => {
    if (currentQty === 0) return 'out-of-stock';
    if (currentQty <= minQty) return 'low-stock';
    return 'in-stock';
  };

  const stockStatus = getStockStatus(item.currentQuantity, item.minimumQuantity);
  
  const getStatusClass = (status) => {
    const statusMap = {
      'in-stock': 'status-in-stock',
      'low-stock': 'status-low-stock',
      'out-of-stock': 'status-out-of-stock'
    };
    return statusMap[status] || 'status-in-stock';
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      'in-stock': 'In Stock',
      'low-stock': 'Low Stock', 
      'out-of-stock': 'Out of Stock'
    };
    return labelMap[status] || 'Unknown';
  };

  return (
    <>
      <tr>
        <td>
          <div className="lead-id">{item.itemCode}</div>
        </td>
        <td>{item.itemName}</td>
        <td>
          <span className="cost-price">AED {item.costPrice}</span>
        </td>
        <td>
          <span className="selling-price">AED {item.sellingPrice}</span>
        </td>
        <td>
          <span className="opening-quantity">{item.openingQuantity}</span>
        </td>
        <td>
          <span className="minimum-quantity">{item.minimumQuantity}</span>
        </td>
        <td>
          <span className={`quantity-badge ${getStatusClass(stockStatus)}`}>
            {item.currentQuantity}
          </span>
        </td>
        <td>
          <span className={`status-badge ${getStatusClass(stockStatus)}`}>
            {getStatusLabel(stockStatus)}
          </span>
        </td>
        <td>
          <div className="action-buttons">
            <button className="action-btn view" onClick={() => handleAction('view')}>
              <i className="fas fa-eye"></i> 
            </button>
            
            <button className="action-btn edit" onClick={() => handleAction('edit')}>
              <i className="fas fa-edit"></i> 
            </button>
            
            <button className="action-btn delete" onClick={() => handleAction('delete')}>
              <i className="fas fa-trash"></i> 
            </button>
          </div>
        </td>
      </tr>

      {showModal && (
        <ViewEditInventoryModal 
          item={item}
          type={modalType}
          onClose={() => setShowModal(false)}
          onUpdate={onInventoryUpdate}
        />
      )}
    </>
  );
};

export default InventoryRow;