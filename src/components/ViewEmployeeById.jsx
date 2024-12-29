import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ViewEmployeeById.css';
import { FaSearch, FaUser, FaPhone, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';

const ViewEmployeeById = () => {
    const [searchId, setSearchId] = useState('');
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchId.trim()) {
            setError('Please enter an employee ID');
            return;
        }

        setLoading(true);
        setError(null);
        setSearched(true);

        try {
            const response = await axios.get(`http://localhost:3005/api/employees/${searchId}`);
            setEmployee(response.data);
            setError(null);
        } catch (err) {
            setEmployee(null);
            setError(err.response?.data?.error || 'Employee not found');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="view-by-id-container">
            <div className="search-section">
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-input-container">
                        <input
                            type="number"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            placeholder="Enter Employee ID"
                            className="search-input"
                            min="1"
                        />
                        <button type="submit" className="search-button">
                            <FaSearch />
                            Search
                        </button>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                </form>
            </div>

            <div className="result-section">
                {loading && (
                    <div className="loading-message">Searching...</div>
                )}

                {!loading && searched && !error && employee && (
                    <div className="employee-card">
                        <div className="card-header">
                            <FaUser className="profile-icon" />
                            <h2>{employee.emp_name}</h2>
                            <span className="employee-id">ID: {employee.emp_id}</span>
                        </div>
                        <div className="card-body">
                            <div className="info-item">
                                <FaDollarSign className="info-icon" />
                                <div className="info-content">
                                    <label>Salary</label>
                                    <span>${employee.emp_salary.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <FaPhone className="info-icon" />
                                <div className="info-content">
                                    <label>Phone</label>
                                    <span>{employee.emp_phone}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <FaMapMarkerAlt className="info-icon" />
                                <div className="info-content">
                                    <label>Address</label>
                                    <span>{employee.emp_address}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!loading && searched && !error && !employee && (
                    <div className="no-result">No employee found with the given ID</div>
                )}
            </div>
        </div>
    );
};

export default ViewEmployeeById;
