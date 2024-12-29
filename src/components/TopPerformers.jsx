import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { FaRupeeSign } from "react-icons/fa";
import { FaTrophy, FaUsers, FaChartLine } from "react-icons/fa";
import "../styles/TopPerformers.css";

const TopPerformers = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const response = await fetch("http://localhost:3005/api/employees");
      const data = await response.json();
      setEmployees(data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching employee data");
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Sort employees by salary to get top performers
  const topPerformers = [...employees]
    .sort((a, b) => b.emp_salary - a.emp_salary)
    .slice(0, 5);

  // Calculate statistics
  const totalEmployees = employees.length;
  const totalSalary = employees.reduce((acc, emp) => acc + emp.emp_salary, 0);
  const averageSalary = totalSalary / totalEmployees;
  const topPerformerAverage = topPerformers.reduce((acc, emp) => acc + emp.emp_salary, 0) / topPerformers.length;
  const percentageAboveAverage = ((topPerformerAverage - averageSalary) / averageSalary) * 100;

  // Prepare data for the chart
  const chartData = topPerformers.map(emp => ({
    name: emp.emp_name,
    salary: emp.emp_salary,
  }));

  return (
    <div className="top-performers-container">
      <div className="stats-grid">
        <div className="stat-card">
          <FaTrophy className="stat-icon gold" />
          <div className="stat-info">
            <h3>Top Performer</h3>
            <p>{topPerformers[0]?.emp_name || "N/A"}</p>
            <small>
              <FaRupeeSign />
              {topPerformers[0]?.emp_salary.toLocaleString() || "0"}
            </small>
          </div>
        </div>

        <div className="stat-card">
          <FaUsers className="stat-icon" />
          <div className="stat-info">
            <h3>Top 5 Average</h3>
            <p>
              <FaRupeeSign />
              {topPerformerAverage.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <FaChartLine className="stat-icon" />
          <div className="stat-info">
            <h3>Above Average</h3>
            <p>{percentageAboveAverage.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      <div className="chart-wrapper">
        <h3>Top 5 Performers by Salary</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [
                `₹${value.toLocaleString()}`,
                "Salary"
              ]}
            />
            <Legend />
            <Bar
              dataKey="salary"
              name="Salary"
              fill="#4f46e5"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopPerformers;
