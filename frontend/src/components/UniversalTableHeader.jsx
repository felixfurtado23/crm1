import React from 'react';

const UniversalTableHeader = ({ 
  stats = [],
  onExport = () => {}
}) => {
  return (
    <div className="table-header universal-table-header">
      <div className="table-stats universal-stats">
        {stats.map((stat, index) => (
          <div key={index} className="table-stat-item">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
      <div className="table-actions universal-table-actions">
        <button className="export-btn" onClick={onExport}>
          <i className="fas fa-download"></i>
          Export
        </button>
      </div>
    </div>
  );
};

export default UniversalTableHeader;