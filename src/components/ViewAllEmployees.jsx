import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ViewAllEmployees.css";

const ViewAllEmployees = ({ onBack }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:3005/api/employees");
      setEmployees(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching employees");
      setLoading(false);
      console.error("Error:", err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="employees-container">
      <h2>Employee List</h2>
      <div className="table-container">
        <table className="employees-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Salary</th>
              <th>Phone</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.emp_id}>
                <td>{employee.emp_id}</td>
                <td>{employee.emp_name}</td>
                <td>${employee.emp_salary.toLocaleString()}</td>
                <td>{employee.emp_phone}</td>
                <td>{employee.emp_address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAllEmployees;
