const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all goals for a user
router.get('/:userId', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [goals] = await connection.query(
      'SELECT * FROM goals WHERE user_id = ? ORDER BY target_date ASC',
      [req.params.userId]
    );
    connection.release();
    res.json(goals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

// Create a new goal
router.post('/', async (req, res) => {
  try {
    const { user_id, title, description, target_date, status } = req.body;
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO goals (user_id, title, description, target_date, status) VALUES (?, ?, ?, ?, ?)',
      [user_id, title, description, target_date, status || 'pending']
    );
    connection.release();
    res.status(201).json({ id: result.insertId, user_id, title, description, target_date });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

// Update a goal
router.put('/:id', async (req, res) => {
  try {
    const { title, description, target_date, status } = req.body;
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE goals SET title = ?, description = ?, target_date = ?, status = ? WHERE id = ?',
      [title, description, target_date, status, req.params.id]
    );
    connection.release();
    res.json({ id: req.params.id, title, description, target_date, status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

// Delete a goal
router.delete('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM goals WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

module.exports = router;
