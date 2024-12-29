import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { FaRupeeSign } from "react-icons/fa";
import { FaChartPie, FaPercent, FaBalanceScale } from "react-icons/fa";
import "../styles/SalaryDistribution.css";

// Updated color palette with more vibrant and contrasting colors
const COLORS = [
  "#FF6B6B",  // Coral Red
  "#4ECDC4",  // Turquoise
  "#45B7D1",  // Sky Blue
  "#96CEB4",  // Sage Green
  "#FFEEAD",  // Soft Yellow
];

const SalaryDistribution = () => {
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

  // Calculate salary ranges and distribution
  const ranges = [
    { range: "0-30k", min: 0, max: 30000 },
    { range: "30k-50k", min: 30000, max: 50000 },
    { range: "50k-70k", min: 50000, max: 70000 },
    { range: "70k-90k", min: 70000, max: 90000 },
    { range: "90k+", min: 90000, max: Infinity },
  ];

  const distribution = ranges.map((range) => {
    const count = employees.filter(
      (emp) => emp.emp_salary > range.min && emp.emp_salary <= range.max
    ).length;
    return {
      name: range.range,
      value: count,
      percentage: ((count / employees.length) * 100).toFixed(1),
    };
  });

  // Calculate statistics
  const totalEmployees = employees.length;
  const averageSalary =
    employees.reduce((acc, emp) => acc + emp.emp_salary, 0) / totalEmployees;
  
  // Calculate median salary
  const sortedSalaries = [...employees]
    .sort((a, b) => a.emp_salary - b.emp_salary)
    .map(emp => emp.emp_salary);
  const medianSalary = sortedSalaries[Math.floor(totalEmployees / 2)];

  // Find most common salary range
  const mostCommonRange = distribution.reduce((prev, current) =>
    prev.value > current.value ? prev : current
  );

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="range">{data.name}</p>
          <p className="count">{`${data.value} employees`}</p>
          <p className="percent">{`${data.percentage}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="salary-distribution-container">
      <div className="stats-grid">
        <div className="stat-card">
          <FaChartPie className="stat-icon" />
          <div className="stat-info">
            <h3>Most Common Range</h3>
            <p>{mostCommonRange.name}</p>
            <small>{mostCommonRange.percentage}% of employees</small>
          </div>
        </div>

        <div className="stat-card">
          <FaBalanceScale className="stat-icon" />
          <div className="stat-info">
            <h3>Median Salary</h3>
            <p>
              <FaRupeeSign />
              {medianSalary.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <FaPercent className="stat-icon" />
          <div className="stat-info">
            <h3>Distribution Balance</h3>
            <p>
              {(
                distribution.reduce(
                  (acc, curr) => acc + Math.abs(20 - curr.percentage),
                  0
                ) / 5
              ).toFixed(1)}
              % variance
            </p>
          </div>
        </div>
      </div>

      <div className="chart-wrapper">
        <h3>Salary Range Distribution</h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={distribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                percent,
                name,
              }) => {
                const radius = outerRadius + 30;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                return (
                  <text
                    x={x}
                    y={y}
                    fill="#111827"
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                  >
                    {`${name} (${(percent * 100).toFixed(1)}%)`}
                  </text>
                );
              }}
            >
              {distribution.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalaryDistribution;
