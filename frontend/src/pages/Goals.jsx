import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Goals({ userId }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_date: '',
    status: 'pending'
  });

  useEffect(() => {
    fetchGoals();
  }, [userId]);

  const fetchGoals = async () => {
    try {
      const response = await axios.get(`${API_URL}/goals/${userId}`);
      setGoals(response.data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredGoals = () => {
    if (filterStatus === 'all') return goals;
    return goals.filter(goal => goal.status === filterStatus);
  };

  const handleAddClick = () => {
    setEditId(null);
    setFormData({ title: '', description: '', target_date: '', status: 'pending' });
    setShowModal(true);
  };

  const handleEditClick = (goal) => {
    setEditId(goal.id);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      target_date: goal.target_date,
      status: goal.status
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/goals/${editId}`, formData);
      } else {
        await axios.post(`${API_URL}/goals`, {
          user_id: userId,
          ...formData
        });
      }
      setShowModal(false);
      fetchGoals();
    } catch (error) {
      console.error('Error saving goal:', error);
      alert('Error saving goal');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`${API_URL}/goals/${id}`);
        fetchGoals();
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  if (loading) return <div className="loading">Loading goals...</div>;

  const filteredGoals = getFilteredGoals();

  return (
    <div className="goals-container">
      <div className="goals-header">
        <div>
          <h1>Academic Goals</h1>
          <p>Set and track your academic goals</p>
        </div>
        <button className="btn-add-exam" onClick={handleAddClick}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Goal
        </button>
      </div>

      <div className="filter-tabs">
        <button className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}>All</button>
        <button className={`filter-tab ${filterStatus === 'pending' ? 'active' : ''}`}
          onClick={() => setFilterStatus('pending')}>Pending</button>
        <button className={`filter-tab ${filterStatus === 'in_progress' ? 'active' : ''}`}
          onClick={() => setFilterStatus('in_progress')}>In Progress</button>
        <button className={`filter-tab ${filterStatus === 'completed' ? 'active' : ''}`}
          onClick={() => setFilterStatus('completed')}>Completed</button>
      </div>

      {filteredGoals.length === 0 ? (
        <div className="empty-state">
          <p>No goals found</p>
        </div>
      ) : (
        <div className="goals-grid">
          {filteredGoals.map(goal => (
            <div key={goal.id} className="goal-card">
              <h3>{goal.title}</h3>
              <p className="goal-description">{goal.description}</p>
              <div className="goal-footer">
                <span className={`status-badge ${goal.status}`}>{goal.status}</span>
                <div className="goal-actions">
                  <button className="btn-sm edit" onClick={() => handleEditClick(goal)}>Edit</button>
                  <button className="btn-sm delete" onClick={() => handleDelete(goal.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editId ? 'Edit Goal' : 'Add Goal'}</h2>
              <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Goal Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter goal title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your goal"
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Target Date</label>
                <input
                  type="date"
                  value={formData.target_date}
                  onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editId ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Goals;
