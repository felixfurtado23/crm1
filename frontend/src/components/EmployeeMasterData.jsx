import React, { useState } from 'react';
import UniversalTableHeader from '../components/UniversalTableHeader';
import AddEmployeeModal from '../components/AddEmployeeModal.jsx';
import ViewEmployeeModal from '../components/ViewEmployeeModal.jsx';

const EmployeeMasterData = () => {
  const [employees, setEmployees] = useState([
    {
      id: 'EMP-1001',
      routingCode: '010',
      iban: 'AE070331234567890123456',
      fromDate: '2024/01/01',
      toDate: '2024/01/31',
      noOfDays: 22,
      fixedSalary: 5000,
      variablePay: 1000,
      daysOnLeave: 0
    },
    {
      id: 'EMP-1002', 
      routingCode: '020',
      iban: 'AE070339876543210987654',
      fromDate: '2024/01/01',
      toDate: '2024/01/31',
      noOfDays: 20,
      fixedSalary: 6000,
      variablePay: 1500,
      daysOnLeave: 2
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [nextEmployeeId, setNextEmployeeId] = useState(1003);

  // Calculate stats for UniversalTableHeader
  const tableStats = [
    { value: employees.length, label: 'Total Employees' },
    { value: `AED ${employees.reduce((sum, emp) => sum + emp.fixedSalary, 0).toLocaleString()}`, label: 'Total Fixed Salary' },
    { value: `AED ${employees.reduce((sum, emp) => sum + emp.variablePay, 0).toLocaleString()}`, label: 'Total Variable Pay' },
    { value: employees.reduce((sum, emp) => sum + emp.daysOnLeave, 0), label: 'Total Leave Days' }
  ];

  const handleAddEmployee = (newEmployeeData) => {
    const newEmployee = {
      id: `EMP-${nextEmployeeId}`,
      ...newEmployeeData
    };

    setEmployees([...employees, newEmployee]);
    setNextEmployeeId(nextEmployeeId + 1);
    setShowAddForm(false);
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  };

  const handleExport = () => {
    alert('Export functionality would be implemented here');
  };

  const handleDeleteEmployee = (employeeId) => {
    if (confirm('Are you sure you want to delete this employee record?')) {
      setEmployees(employees.filter(emp => emp.id !== employeeId));
    }
  };

  return (
    <div className="content-area">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Employee Master Data</h1>
          <p className="page-subtitle">Manage employee salary records and WPS data</p>
        </div>
        <button className="page-header-btn" onClick={() => setShowAddForm(true)}>
          <i className="fas fa-plus"></i>
          Add Employee
        </button>
      </div>

      <div className="data-table-container">
        <UniversalTableHeader
          stats={tableStats}
          onExport={handleExport}
        />

        <table className="data-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Routing Code</th>
              <th>IBAN</th>
              <th>From Date (yyyy/mm/dd)</th>
              <th>To Date (yyyy/mm/dd)</th>
              <th>No of Days</th>
              <th>Fixed Salary</th>
              {/* <th>Variable Pay</th> */}
              {/* <th>Days on Leave</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.id}>
                <td>
                  <span className="lead-id">{employee.id}</span>
                </td>
                <td>{employee.routingCode}</td>
                <td>{employee.iban}</td>
                <td>{employee.fromDate}</td>
                <td>{employee.toDate}</td>
                <td>{employee.noOfDays}</td>
                {/* <td>AED {employee.fixedSalary.toFixed(2)}</td> */}
                <td>AED {Number(employee.variablePay).toLocaleString()}</td>
                {/* <td>{employee.daysOnLeave}</td> */}
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-btn view" 
                      onClick={() => handleViewEmployee(employee)}
                      title="View Details"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button 
                      className="action-btn edit"
                      title="Edit Employee"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="action-btn delete" 
                      onClick={() => handleDeleteEmployee(employee.id)}
                      title="Delete Employee"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {employees.length === 0 && (
          <div className="data-empty-state">
            <i className="fas fa-users data-empty-icon"></i>
            <h3>No Employee Records</h3>
            <p>Get started by adding your first employee record</p>
            <button className="btn" onClick={() => setShowAddForm(true)}>
              <i className="fas fa-plus"></i>
              Add Employee
            </button>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {showAddForm && (
        <AddEmployeeModal
          onClose={() => setShowAddForm(false)}
          onSave={handleAddEmployee}
        />
      )}

      {/* View Employee Modal */}
      {showViewModal && selectedEmployee && (
        <ViewEmployeeModal
          employee={selectedEmployee}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </div>
  );
};

export default EmployeeMasterData;