const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all study tips for a user
router.get('/:userId', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [tips] = await connection.query(
      `SELECT st.*, s.name as subject_name FROM study_tips st 
       LEFT JOIN subjects s ON st.subject_id = s.id 
       WHERE st.user_id = ? 
       ORDER BY st.created_at DESC`,
      [req.params.userId]
    );
    connection.release();
    res.json(tips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch study tips' });
  }
});

// Create a new study tip
router.post('/', async (req, res) => {
  try {
    const { user_id, subject_id, title, content } = req.body;
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO study_tips (user_id, subject_id, title, content) VALUES (?, ?, ?, ?)',
      [user_id, subject_id, title, content]
    );
    connection.release();
    res.status(201).json({ id: result.insertId, user_id, subject_id, title, content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create study tip' });
  }
});

// Update a study tip
router.put('/:id', async (req, res) => {
  try {
    const { title, content, subject_id } = req.body;
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE study_tips SET title = ?, content = ?, subject_id = ? WHERE id = ?',
      [title, content, subject_id, req.params.id]
    );
    connection.release();
    res.json({ id: req.params.id, title, content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update study tip' });
  }
});

// Delete a study tip
router.delete('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM study_tips WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Study tip deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete study tip' });
  }
});

module.exports = router;
