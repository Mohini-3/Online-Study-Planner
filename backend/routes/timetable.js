const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all timetable entries for a user
router.get('/:userId', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [timetable] = await connection.query(
      `SELECT t.*, s.name as subject_name FROM timetable t 
       LEFT JOIN subjects s ON t.subject_id = s.id 
       WHERE t.user_id = ? 
       ORDER BY FIELD(t.day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), t.start_time`,
      [req.params.userId]
    );
    connection.release();
    res.json(timetable);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch timetable' });
  }
});

// Create a new timetable entry
router.post('/', async (req, res) => {
  try {
    const { user_id, subject_id, day, start_time, end_time, topic } = req.body;
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO timetable (user_id, subject_id, day, start_time, end_time, topic) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, subject_id, day, start_time, end_time, topic]
    );
    connection.release();
    res.status(201).json({ id: result.insertId, user_id, subject_id, day, start_time, end_time, topic });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create timetable entry' });
  }
});

// Update a timetable entry
router.put('/:id', async (req, res) => {
  try {
    const { subject_id, day, start_time, end_time, topic } = req.body;
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE timetable SET subject_id = ?, day = ?, start_time = ?, end_time = ?, topic = ? WHERE id = ?',
      [subject_id, day, start_time, end_time, topic, req.params.id]
    );
    connection.release();
    res.json({ id: req.params.id, subject_id, day, start_time, end_time, topic });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update timetable entry' });
  }
});

// Delete a timetable entry
router.delete('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM timetable WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Timetable entry deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete timetable entry' });
  }
});

module.exports = router;
