import React, { useState, useEffect } from "react";
import "../styles/SalaryTrends.css";
import {
  AreaChart,
  Area,
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
import { TrendingUp, Users } from "lucide-react";

const SalaryTrends = () => {
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

  // Calculate statistics
  const salaries = employees.map((emp) => emp.emp_salary);
  const averageSalary = salaries.reduce((a, b) => a + b, 0) / salaries.length;
  const maxSalary = Math.max(...salaries);
  const sortedSalaries = [...salaries].sort((a, b) => a - b);
  const medianSalary = sortedSalaries[Math.floor(salaries.length / 2)];

  // Create salary ranges for distribution
  const salaryRanges = [
    { range: "0-30k", count: 0 },
    { range: "30k-50k", count: 0 },
    { range: "50k-70k", count: 0 },
    { range: "70k-90k", count: 0 },
    { range: "90k+", count: 0 },
  ];

  employees.forEach((emp) => {
    const salary = emp.emp_salary;
    if (salary <= 30000) salaryRanges[0].count++;
    else if (salary <= 50000) salaryRanges[1].count++;
    else if (salary <= 70000) salaryRanges[2].count++;
    else if (salary <= 90000) salaryRanges[3].count++;
    else salaryRanges[4].count++;
  });

  return (
    <div className="salary-trends-container">
      <div className="stats-grid">
        <div className="stat-card">
          <FaRupeeSign className="stat-icon" />
          <div className="stat-info">
            <h3>Average Salary</h3>
            <p>
              <FaRupeeSign />
              {averageSalary.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
        </div>
        <div className="stat-card">
          <TrendingUp className="stat-icon" />
          <div className="stat-info">
            <h3>Median Salary</h3>
            <p>
              <FaRupeeSign />
              {medianSalary.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
        </div>
        <div className="stat-card">
          <FaRupeeSign className="stat-icon" />
          <div className="stat-info">
            <h3>Highest Salary</h3>
            <p>
              <FaRupeeSign />
              {maxSalary.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
        </div>
        <div className="stat-card">
          <Users className="stat-icon" />
          <div className="stat-info">
            <h3>Total Employees</h3>
            <p>{employees.length}</p>
          </div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-wrapper">
          <h3>Salary Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salaryRanges}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Number of Employees" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-wrapper">
          <h3>Individual Salaries</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={employees.map((emp, index) => ({
                name: emp.emp_name,
                salary: emp.emp_salary,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="salary"
                name="Salary"
                stroke="#4f46e5"
                fill="#4f46e5"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalaryTrends;
