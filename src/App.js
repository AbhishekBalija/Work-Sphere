import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import EmpDetails from './components/EmpDetails';
import DashboardComponent from './components/DashBoard';
import ViewAllEmployees from './components/ViewAllEmployees';
import ViewEmployeeById from './components/ViewEmployeeById';
import AddEmployee from './components/AddEmployee';
import UpdateEmployee from './components/UpdateEmployee';
import RemoveEmployee from './components/RemoveEmployee';
import SalaryTrends from './components/SalaryTrends';
import TopPerformers from './components/TopPerformers';
import SalaryDistribution from './components/SalaryDistribution';
import EmployeeDistribution from './components/EmployeeDistribution';

const App = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [showSalaryTrends, setShowSalaryTrends] = useState(false);
  const [showTopPerformers, setShowTopPerformers] = useState(false);
  const [showSalaryDistribution, setShowSalaryDistribution] = useState(false);
  const [showEmployeeDistribution, setShowEmployeeDistribution] = useState(false);

  const handleMenuClick = (option) => {
    setActiveComponent(option);
    setShowSalaryTrends(false);
    setShowTopPerformers(false);
    setShowSalaryDistribution(false);
    setShowEmployeeDistribution(false);
  };

  const handleDashboardClick = (title) => {
    if (title === "Average Salary Trends") {
      setShowSalaryTrends(true);
      setShowTopPerformers(false);
      setShowSalaryDistribution(false);
      setShowEmployeeDistribution(false);
    } else if (title === "Top Performers") {
      setShowTopPerformers(true);
      setShowSalaryTrends(false);
      setShowSalaryDistribution(false);
      setShowEmployeeDistribution(false);
    } else if (title === "Salary Distribution") {
      setShowSalaryDistribution(true);
      setShowSalaryTrends(false);
      setShowTopPerformers(false);
      setShowEmployeeDistribution(false);
    } else if (title === "Employee Distribution") {
      setShowEmployeeDistribution(true);
      setShowSalaryTrends(false);
      setShowTopPerformers(false);
      setShowSalaryDistribution(false);
    }
  };

  const renderDashboard = () => (
    <div className="dashboard-section">
      <div onClick={() => handleDashboardClick("Average Salary Trends")}>
        <DashboardComponent title="Average Salary Trends" />
      </div>
      <div onClick={() => handleDashboardClick("Top Performers")}>
        <DashboardComponent title="Top Performers" />
      </div>
      <div onClick={() => handleDashboardClick("Salary Distribution")}>
        <DashboardComponent title="Salary Distribution" />
      </div>
      <div onClick={() => handleDashboardClick("Employee Distribution")}>
        <DashboardComponent title="Employee Distribution" />
      </div>
    </div>
  );

  const renderComponent = () => {
    if (showSalaryTrends) {
      return <SalaryTrends />;
    }
    if (showTopPerformers) {
      return <TopPerformers />;
    }
    if (showSalaryDistribution) {
      return <SalaryDistribution />;
    }
    if (showEmployeeDistribution) {
      return <EmployeeDistribution />;
    }
    
    switch (activeComponent) {
      case 'viewAll':
        return <ViewAllEmployees />;
      case 'viewById':
        return <ViewEmployeeById />;
      case 'add':
        return <AddEmployee />;
      case 'update':
        return <UpdateEmployee />;
      case 'remove':
        return <RemoveEmployee />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <EmpDetails 
          onOptionClick={handleMenuClick} 
          showSalaryTrends={showSalaryTrends}
          showTopPerformers={showTopPerformers}
          showSalaryDistribution={showSalaryDistribution}
          showEmployeeDistribution={showEmployeeDistribution}
        />
        {renderComponent()}
      </div>
    </div>
  );
};

export default App;