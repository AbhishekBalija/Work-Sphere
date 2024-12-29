import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { FaMapMarkerAlt, FaUsers, FaCity } from "react-icons/fa";
import "../styles/EmployeeDistribution.css";

// Modern, vibrant color palette
const COLORS = [
  "#FF6B6B",  // Coral Red
  "#4ECDC4",  // Turquoise
  "#45B7D1",  // Sky Blue
  "#96CEB4",  // Sage Green
  "#FFEEAD",  // Soft Yellow
  "#FFD93D",  // Golden Yellow
  "#6C5CE7",  // Purple
  "#A8E6CF",  // Mint
];

const EmployeeDistribution = () => {
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

  // Process locations from addresses and group smaller locations
  const locationMap = employees.reduce((acc, emp) => {
    const addressParts = emp.emp_address.split(',');
    const city = addressParts.length > 1 
      ? addressParts[1].trim().toLowerCase()
      : emp.emp_address.trim().toLowerCase();
    
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  // Convert to array and sort by count
  let locationData = Object.entries(locationMap)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      percentage: ((value / employees.length) * 100).toFixed(1)
    }))
    .sort((a, b) => b.value - a.value);

  // Take top 5 locations and group the rest as "Others"
  const TOP_LOCATIONS = 5;
  const othersData = locationData.slice(TOP_LOCATIONS).reduce(
    (acc, curr) => ({
      name: "Others",
      value: acc.value + curr.value,
      percentage: (parseFloat(acc.percentage) + parseFloat(curr.percentage)).toFixed(1)
    }),
    { name: "Others", value: 0, percentage: "0" }
  );

  // Final data for pie chart (top 5 + others)
  const pieChartData = [
    ...locationData.slice(0, TOP_LOCATIONS),
    othersData
  ];

  // Bar chart can show more details (top 10)
  const barChartData = locationData.slice(0, 10);

  // Find the location with most employees
  const mostPopularLocation = locationData[0];
  
  // Calculate how many locations have more than 1 employee
  const activeLocations = locationData.filter(loc => loc.value > 1).length;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="location">{data.name}</p>
          <p className="count">{`${data.value} employees`}</p>
          <p className="percent">{`${data.percentage}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="employee-distribution-container">
      <div className="stats-grid">
        <div className="stat-card">
          <FaMapMarkerAlt className="stat-icon" />
          <div className="stat-info">
            <h3>Most Popular Location</h3>
            <p>{mostPopularLocation.name}</p>
            <small>{mostPopularLocation.percentage}% of employees</small>
          </div>
        </div>

        <div className="stat-card">
          <FaCity className="stat-icon" />
          <div className="stat-info">
            <h3>Active Locations</h3>
            <p>{activeLocations}</p>
            <small>with multiple employees</small>
          </div>
        </div>

        <div className="stat-card">
          <FaUsers className="stat-icon" />
          <div className="stat-info">
            <h3>Total Employees</h3>
            <p>{employees.length}</p>
            <small>across all locations</small>
          </div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-wrapper">
          <h3>Location Distribution (Top 5)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
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
                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius * 1.2;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="#111827"
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                      fontSize="12"
                    >
                      {`${name} (${(percent * 100).toFixed(1)}%)`}
                    </text>
                  );
                }}
              >
                {pieChartData.map((entry, index) => (
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

        <div className="chart-wrapper">
          <h3>Location Distribution (Top 10)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={70}
                interval={0}
                fontSize={12}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="value"
                name="Employees"
                fill="#4f46e5"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDistribution;
