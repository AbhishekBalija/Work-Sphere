import React, { useState } from "react";
import {
  FaUsers,
  FaUserPlus,
  FaUserEdit,
  FaUserMinus,
  FaIdBadge,
  FaArrowLeft,
} from "react-icons/fa";
import "../App.css";

const EmpDetails = ({ onOptionClick }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const menuOptions = [
    {
      id: "viewAll",
      label: "View All Employees",
      icon: <FaUsers />,
      description: "See complete employee list",
    },
    {
      id: "viewById",
      label: "View By ID",
      icon: <FaIdBadge />,
      description: "Search employee by ID",
    },
    {
      id: "add",
      label: "Add Employee",
      icon: <FaUserPlus />,
      description: "Create new employee record",
    },
    {
      id: "update",
      label: "Update Employee",
      icon: <FaUserEdit />,
      description: "Modify existing records",
    },
    {
      id: "remove",
      label: "Remove Employee",
      icon: <FaUserMinus />,
      description: "Delete employee records",
    },
  ];

  const handleOptionClick = (option) => {
    setSelectedOption(option.id);
    onOptionClick(option.id);
  };

  const handleBack = () => {
    setSelectedOption(null);
    onOptionClick("dashboard");
  };

  return (
    <div className="emp-details-container">
      <div className="menu-options">
        {menuOptions.map((option) => (
          <button
            key={option.id}
            className={`menu-button ${
              selectedOption === option.id ? "selected" : ""
            }`}
            onClick={() => handleOptionClick(option)}
            title={option.description}
          >
            {option.icon}
            <span className="menu-text">{option.label}</span>
          </button>
        ))}
        {selectedOption && (
          <button
            className="menu-button back-button"
            onClick={handleBack}
            title="Return to dashboard"
          >
            <FaArrowLeft />
            <span className="menu-text">Back</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default EmpDetails;
