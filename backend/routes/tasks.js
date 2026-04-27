const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all tasks for a user
router.get('/:userId', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [tasks] = await connection.query(
      `SELECT t.*, s.name as subject_name FROM tasks t 
       LEFT JOIN subjects s ON t.subject_id = s.id 
       WHERE t.user_id = ? 
       ORDER BY t.due_date ASC`,
      [req.params.userId]
    );
    connection.release();
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const { user_id, subject_id, title, due_date, status } = req.body;
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO tasks (user_id, subject_id, title, due_date, status) VALUES (?, ?, ?, ?, ?)',
      [user_id, subject_id, title, due_date, status || 'pending']
    );
    connection.release();
    res.status(201).json({ id: result.insertId, user_id, subject_id, title, due_date });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const { title, due_date, status, subject_id } = req.body;
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE tasks SET title = ?, due_date = ?, status = ?, subject_id = ? WHERE id = ?',
      [title, due_date, status, subject_id, req.params.id]
    );
    connection.release();
    res.json({ id: req.params.id, title, due_date, status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
