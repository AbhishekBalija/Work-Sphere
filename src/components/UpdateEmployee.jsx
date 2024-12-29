import React, { useState } from 'react';
import axios from 'axios';
import '../styles/UpdateEmployee.css';
import { FaUser, FaPhone, FaMapMarkerAlt, FaDollarSign, FaSearch } from 'react-icons/fa';

const UpdateEmployee = () => {
    const initialFormData = {
        name: '',
        salary: '',
        phone: '',
        address: ''
    };

    const [searchId, setSearchId] = useState('');
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [employeeFound, setEmployeeFound] = useState(false);

    const handleSearch = async () => {
        if (!searchId.trim()) {
            setError('Please enter an employee ID');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await axios.get(`http://localhost:3005/api/employees/${searchId}`);
            const employee = response.data;
            
            setFormData({
                name: employee.emp_name,
                salary: employee.emp_salary,
                phone: employee.emp_phone,
                address: employee.emp_address
            });
            
            setEmployeeFound(true);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || 'Employee not found');
            setEmployeeFound(false);
            setFormData(initialFormData);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null);
        setSuccess(false);
    };

    const validateForm = () => {
        if (!formData.name.trim()) return 'Name is required';
        if (!formData.salary || formData.salary <= 0) return 'Please enter a valid salary';
        if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) return 'Please enter a valid 10-digit phone number';
        if (!formData.address.trim()) return 'Address is required';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await axios.put(`http://localhost:3005/api/employees/${searchId}`, {
                emp_name: formData.name,
                emp_salary: parseFloat(formData.salary),
                emp_phone: formData.phone,
                emp_address: formData.address
            });
            
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Error updating employee');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="update-employee-container">
            <div className="form-card">
                <div className="form-header">
                    <h2>Update Employee</h2>
                    <p>Enter employee ID to update details</p>
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

                {employeeFound && (
                    <form onSubmit={handleSubmit} className="employee-form">
                        <div className="form-row">
                            <div className="form-field">
                                <div className="field-label">
                                    <FaUser className="field-icon" />
                                    <label>Full Name</label>
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                />
                            </div>

                            <div className="form-field">
                                <div className="field-label">
                                    <FaDollarSign className="field-icon" />
                                    <label>Salary</label>
                                </div>
                                <input
                                    type="number"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    placeholder="Enter salary"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-field">
                                <div className="field-label">
                                    <FaPhone className="field-icon" />
                                    <label>Phone Number</label>
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter 10-digit phone number"
                                    maxLength="10"
                                />
                            </div>

                            <div className="form-field">
                                <div className="field-label">
                                    <FaMapMarkerAlt className="field-icon" />
                                    <label>Address</label>
                                </div>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter full address"
                                    rows="2"
                                />
                            </div>
                        </div>

                        {error && <div className="error-message">{error}</div>}
                        {success && (
                            <div className="success-message">
                                Employee updated successfully!
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className={`submit-button ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Employee'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UpdateEmployee;
