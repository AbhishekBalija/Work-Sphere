const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3005;

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://worksphere-frontend.onrender.com'
    : 'http://localhost:3000'
}));

app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
  connection.release();
});

// Routes
app.get('/api/employees', (req, res) => {
  const query = 'SELECT * FROM EmployeeDetails';
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      res.status(500).json({ error: 'Error fetching employees' });
      return;
    }
    res.json(results);
  });
});

// Get employee by ID
app.get('/api/employees/:id', (req, res) => {
  const employeeId = req.params.id;
  const query = 'SELECT * FROM EmployeeDetails WHERE emp_id = ?';
  
  pool.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error('Error fetching employee:', err);
      res.status(500).json({ error: 'Error fetching employee' });
      return;
    }
    
    if (results.length === 0) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }
    
    res.json(results[0]);
  });
});

// Add new employee
app.post('/api/employees', (req, res) => {
  const { emp_name, emp_salary, emp_phone, emp_address } = req.body;

  // Validate required fields
  if (!emp_name || !emp_salary || !emp_phone || !emp_address) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  const query = 'INSERT INTO EmployeeDetails (emp_name, emp_salary, emp_phone, emp_address) VALUES (?, ?, ?, ?)';
  const values = [emp_name, emp_salary, emp_phone, emp_address];

  pool.query(query, values, (err, result) => {
    if (err) {
      console.error('Error adding employee:', err);
      res.status(500).json({ error: 'Error adding employee' });
      return;
    }
    
    res.status(201).json({
      message: 'Employee added successfully',
      employeeId: result.insertId
    });
  });
});

// Update employee
app.put('/api/employees/:id', (req, res) => {
  const employeeId = req.params.id;
  const { emp_name, emp_salary, emp_phone, emp_address } = req.body;

  // Validate required fields
  if (!emp_name || !emp_salary || !emp_phone || !emp_address) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  const query = 'UPDATE EmployeeDetails SET emp_name = ?, emp_salary = ?, emp_phone = ?, emp_address = ? WHERE emp_id = ?';
  const values = [emp_name, emp_salary, emp_phone, emp_address, employeeId];

  pool.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating employee:', err);
      res.status(500).json({ error: 'Error updating employee' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }
    
    res.json({ message: 'Employee updated successfully' });
  });
});

// Delete employee
app.delete('/api/employees/:id', (req, res) => {
  const employeeId = req.params.id;
  const query = 'DELETE FROM EmployeeDetails WHERE emp_id = ?';
  
  pool.query(query, [employeeId], (err, result) => {
    if (err) {
      console.error('Error deleting employee:', err);
      res.status(500).json({ error: 'Error deleting employee' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }
    
    res.json({ message: 'Employee deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
