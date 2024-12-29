import React from "react";
import { FaBriefcase } from 'react-icons/fa';
import '../App.css';

const Header = () => {
  return (
    <div className="header">
      <h1>
        <FaBriefcase style={{ marginRight: '10px' }} />
        WORKSPHERE
      </h1>
    </div>
  );
};

export default Header;
