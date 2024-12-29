import React from 'react';
import { FaChartBar, FaChartPie, FaChartLine, FaMapMarkerAlt } from 'react-icons/fa';
import '../App.css';

const DashboardComponent = ({ title, children }) => {
  const getIcon = (title) => {
    if (title.toLowerCase().includes('salary')) return <FaChartBar />;
    if (title.toLowerCase().includes('top')) return <FaChartLine />;
    if (title.toLowerCase().includes('distribution')) return <FaChartPie />;
    return <FaMapMarkerAlt />;
  };

  return (
    <div className="dashboard-component">
      <h2 className="component-title">
        {getIcon(title)}
        {title}
      </h2>
      <div className="component-content">
        {children}
      </div>
    </div>
  );
};

export default DashboardComponent;
