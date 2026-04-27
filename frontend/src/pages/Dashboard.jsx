import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Dashboard({ userId, userName }) {
  const [stats, setStats] = useState({
    subjects: 0,
    exams: 0,
    tasks: 0,
    goals: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [userId]);

  const fetchStats = async () => {
    try {
      const [subjects, exams, tasks, goals] = await Promise.all([
        axios.get(`${API_URL}/subjects/${userId}`),
        axios.get(`${API_URL}/exams/${userId}`),
        axios.get(`${API_URL}/tasks/${userId}`),
        axios.get(`${API_URL}/goals/${userId}`)
      ]);

      setStats({
        subjects: subjects.data.length,
        exams: exams.data.length,
        tasks: tasks.data.length,
        goals: goals.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {userName}!</h1>
        <p>Here's an overview of your study planner</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-book"></i></div>
          <h3>Subjects</h3>
          <p className="stat-number">{stats.subjects}</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-file-alt"></i></div>
          <h3>Exams</h3>
          <p className="stat-number">{stats.exams}</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-tasks"></i></div>
          <h3>Tasks</h3>
          <p className="stat-number">{stats.tasks}</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-bullseye"></i></div>
          <h3>Goals</h3>
          <p className="stat-number">{stats.goals}</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Get Started</h2>
          <p>Use the sidebar to navigate through different sections of your study planner:</p>
          <ul>
            <li><strong>Subjects:</strong> Manage all your academic subjects</li>
            <li><strong>Exam Tracker:</strong> Track your upcoming and completed exams</li>
            <li><strong>Tasks:</strong> Organize your study tasks</li>
            <li><strong>Goals:</strong> Set and track your academic goals</li>
            <li><strong>Study Tips:</strong> Save helpful study tips and resources</li>
            <li><strong>Timetable:</strong> Create and manage your weekly study schedule</li>
            <li><strong>Weekly Plan:</strong> Plan your academic week</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
