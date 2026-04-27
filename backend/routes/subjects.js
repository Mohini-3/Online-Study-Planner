const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all subjects for a user
router.get('/:userId', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [subjects] = await connection.query(
      'SELECT * FROM subjects WHERE user_id = ? ORDER BY name',
      [req.params.userId]
    );
    connection.release();
    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

// Create a new subject
router.post('/', async (req, res) => {
  try {
    const { user_id, name, code, difficulty } = req.body;
    
    if (!user_id || !name) {
      return res.status(400).json({ error: 'user_id and name are required' });
    }

    const connection = await pool.getConnection();
    
    // Verify user exists first
    const [userCheck] = await connection.query(
      'SELECT id FROM users WHERE id = ?',
      [user_id]
    );
    
    if (userCheck.length === 0) {
      connection.release();
      return res.status(404).json({ error: `User with ID ${user_id} not found. Please register/login again.` });
    }
    
    const [result] = await connection.query(
      'INSERT INTO subjects (user_id, name, code) VALUES (?, ?, ?)',
      [user_id, name, code || null]
    );
    connection.release();
    res.status(201).json({ id: result.insertId, user_id, name, code });
  } catch (error) {
    console.error('Subject creation error:', error);
    res.status(500).json({ error: 'Failed to create subject' });
  }
});

// Update a subject
router.put('/:id', async (req, res) => {
  try {
    const { name, code } = req.body;
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE subjects SET name = ?, code = ? WHERE id = ?',
      [name, code, req.params.id]
    );
    connection.release();
    res.json({ id: req.params.id, name, code });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update subject' });
  }
});

// Delete a subject
router.delete('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM subjects WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Subject deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete subject' });
  }
});

module.exports = router;
