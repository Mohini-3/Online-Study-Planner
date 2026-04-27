const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all exams for a user
router.get('/:userId', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [exams] = await connection.query(
      `SELECT e.*, s.name as subject_name FROM exams e 
       LEFT JOIN subjects s ON e.subject_id = s.id 
       WHERE e.user_id = ? 
       ORDER BY e.exam_date DESC`,
      [req.params.userId]
    );
    connection.release();
    res.json(exams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch exams' });
  }
});

// Create a new exam
router.post('/', async (req, res) => {
  try {
    const { user_id, subject_id, exam_name, exam_date, status } = req.body;
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO exams (user_id, subject_id, exam_name, exam_date, status) VALUES (?, ?, ?, ?, ?)',
      [user_id, subject_id, exam_name, exam_date, status || 'scheduled']
    );
    connection.release();
    res.status(201).json({ id: result.insertId, user_id, subject_id, exam_name, exam_date });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create exam' });
  }
});

// Update an exam
router.put('/:id', async (req, res) => {
  try {
    const { exam_name, exam_date, status, subject_id } = req.body;
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE exams SET exam_name = ?, exam_date = ?, status = ?, subject_id = ? WHERE id = ?',
      [exam_name, exam_date, status, subject_id, req.params.id]
    );
    connection.release();
    res.json({ id: req.params.id, exam_name, exam_date, status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update exam' });
  }
});

// Delete an exam
router.delete('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM exams WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Exam deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete exam' });
  }
});

module.exports = router;
