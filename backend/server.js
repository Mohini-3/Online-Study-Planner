const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import database initialization
const initializeDatabase = require('./config/init-db');

// Import routes
const userRoutes = require('./routes/users');
const subjectRoutes = require('./routes/subjects');
const taskRoutes = require('./routes/tasks');
const goalRoutes = require('./routes/goals');
const examRoutes = require('./routes/exams');
const studytipRoutes = require('./routes/studytips');
const weeklyplanRoutes = require('./routes/weeklyplan');
const timetableRoutes = require('./routes/timetable');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/studytips', studytipRoutes);
app.use('/api/weeklyplan', weeklyplanRoutes);
app.use('/api/timetable', timetableRoutes);

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

const PORT = process.env.PORT || 5000;

// Initialize database and start server
(async () => {
  try {
    console.log('Starting application...');
    await initializeDatabase();
    console.log(`Server is running on port ${PORT}`);
    app.listen(PORT);
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
})();
