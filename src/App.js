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

const App = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');

  const handleMenuClick = (option) => {
    setActiveComponent(option);
  };

  const renderDashboard = () => (
    <div className="dashboard-section">
      <DashboardComponent title="Average Salary Trends" />
      <DashboardComponent title="Top Performers" />
      <DashboardComponent title="Salary Distribution" />
      <DashboardComponent title="Employee Distribution" />
    </div>
  );

  const renderComponent = () => {
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
        <EmpDetails onOptionClick={handleMenuClick} />
        {renderComponent()}
      </div>
    </div>
  );
};

export default App;