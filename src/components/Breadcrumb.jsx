import React from 'react';
import './Breadcrumb.css';
import { FaHome } from 'react-icons/fa';

const Breadcrumb = () => {
  return (
    <nav className="breadcrumb">
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item">
          <FaHome className="breadcrumb-home" />
        </li>
        <li className="breadcrumb-item">Resource Management</li>
        <li className="breadcrumb-item active">Server Management</li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;