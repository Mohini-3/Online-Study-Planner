const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all weekly plans for a user
router.get('/:userId', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [plans] = await connection.query(
      'SELECT * FROM weekly_plans WHERE user_id = ? ORDER BY week_start DESC',
      [req.params.userId]
    );
    connection.release();
    res.json(plans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch weekly plans' });
  }
});

// Create a new weekly plan
router.post('/', async (req, res) => {
  try {
    const { user_id, week_start, description } = req.body;
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO weekly_plans (user_id, week_start, description) VALUES (?, ?, ?)',
      [user_id, week_start, description]
    );
    connection.release();
    res.status(201).json({ id: result.insertId, user_id, week_start, description });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create weekly plan' });
  }
});

// Update a weekly plan
router.put('/:id', async (req, res) => {
  try {
    const { week_start, description } = req.body;
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE weekly_plans SET week_start = ?, description = ? WHERE id = ?',
      [week_start, description, req.params.id]
    );
    connection.release();
    res.json({ id: req.params.id, week_start, description });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update weekly plan' });
  }
});

// Delete a weekly plan
router.delete('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM weekly_plans WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Weekly plan deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete weekly plan' });
  }
});

module.exports = router;
