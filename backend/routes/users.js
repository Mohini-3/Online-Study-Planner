const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [users] = await connection.query(
      'SELECT id, full_name, email, created_at FROM users WHERE id = ?',
      [req.params.id]
    );
    connection.release();
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(users[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create a new user (registration)
router.post('/register', async (req, res) => {
  try {
    const { full_name, email, password } = req.body;
    
    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await pool.getConnection();
    
    // Check if email already exists
    const [existing] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ error: 'Email already registered' });
    }

    // For now, store password as plain text (in production use bcrypt)
    const [result] = await connection.query(
      'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
      [full_name, email, password]
    );
    connection.release();
    
    res.status(201).json({ 
      id: result.insertId, 
      full_name, 
      email,
      message: 'User registered successfully' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const connection = await pool.getConnection();
    const [users] = await connection.query(
      'SELECT id, full_name, email, password_hash FROM users WHERE email = ?',
      [email]
    );
    connection.release();

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];
    
    // Simple password comparison (in production use bcrypt.compare)
    if (user.password_hash !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({ 
      success: true,
      id: user.id, 
      full_name: user.full_name, 
      email: user.email 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Update user profile
router.put('/:id', async (req, res) => {
  try {
    const { full_name, email } = req.body;
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE users SET full_name = ?, email = ? WHERE id = ?',
      [full_name, email, req.params.id]
    );
    connection.release();
    res.json({ id: req.params.id, full_name, email, message: 'Profile updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
