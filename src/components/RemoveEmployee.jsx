import React, { useState } from 'react';
import axios from 'axios';
import '../styles/RemoveEmployee.css';
import { FaUser, FaPhone, FaMapMarkerAlt, FaDollarSign, FaSearch, FaTrash } from 'react-icons/fa';

const RemoveEmployee = () => {
    const [searchId, setSearchId] = useState('');
    const [employeeData, setEmployeeData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleSearch = async () => {
        if (!searchId.trim()) {
            setError('Please enter an employee ID');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);
        setEmployeeData(null);

        try {
            const response = await axios.get(`http://localhost:3005/api/employees/${searchId}`);
            setEmployeeData(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || 'Employee not found');
            setEmployeeData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await axios.delete(`http://localhost:3005/api/employees/${searchId}`);
            setSuccess(true);
            setEmployeeData(null);
            setSearchId('');
            setShowConfirmation(false);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Error removing employee');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="remove-employee-container">
            <div className="form-card">
                <div className="form-header">
                    <h2>Remove Employee</h2>
                    <p>Enter employee ID to remove employee</p>
                </div>

                <div className="search-section">
                    <div className="search-box">
                        <input
                            type="number"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            placeholder="Enter Employee ID"
                            min="1"
                        />
                        <button 
                            onClick={handleSearch}
                            disabled={loading}
                            className="search-button"
                        >
                            <FaSearch />
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && (
                    <div className="success-message">
                        Employee removed successfully!
                    </div>
                )}

                {employeeData && !showConfirmation && (
                    <div className="employee-card">
                        <div className="employee-info">
                            <div className="info-row">
                                <div className="info-item">
                                    <FaUser className="info-icon" />
                                    <div className="info-content">
                                        <label>Name</label>
                                        <span>{employeeData.emp_name}</span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <FaDollarSign className="info-icon" />
                                    <div className="info-content">
                                        <label>Salary</label>
                                        <span>${employeeData.emp_salary}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="info-row">
                                <div className="info-item">
                                    <FaPhone className="info-icon" />
                                    <div className="info-content">
                                        <label>Phone</label>
                                        <span>{employeeData.emp_phone}</span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <FaMapMarkerAlt className="info-icon" />
                                    <div className="info-content">
                                        <label>Address</label>
                                        <span>{employeeData.emp_address}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button 
                            className="remove-button"
                            onClick={() => setShowConfirmation(true)}
                            disabled={loading}
                        >
                            <FaTrash />
                            Remove Employee
                        </button>
                    </div>
                )}

                {showConfirmation && (
                    <div className="confirmation-dialog">
                        <h3>Confirm Removal</h3>
                        <p>Are you sure you want to remove this employee? This action cannot be undone.</p>
                        <div className="confirmation-buttons">
                            <button 
                                className="cancel-button"
                                onClick={() => setShowConfirmation(false)}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button 
                                className="confirm-button"
                                onClick={handleRemove}
                                disabled={loading}
                            >
                                {loading ? 'Removing...' : 'Confirm Remove'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RemoveEmployee;
