import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function WeeklyPlan({ userId }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    week_start: '',
    description: ''
  });

  useEffect(() => {
    fetchPlans();
  }, [userId]);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${API_URL}/weeklyplan/${userId}`);
      setPlans(response.data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditId(null);
    setFormData({ week_start: '', description: '' });
    setShowModal(true);
  };

  const handleEditClick = (plan) => {
    setEditId(plan.id);
    setFormData({
      week_start: plan.week_start,
      description: plan.description || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/weeklyplan/${editId}`, formData);
      } else {
        await axios.post(`${API_URL}/weeklyplan`, {
          user_id: userId,
          ...formData
        });
      }
      setShowModal(false);
      fetchPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Error saving plan');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`${API_URL}/weeklyplan/${id}`);
        fetchPlans();
      } catch (error) {
        console.error('Error deleting plan:', error);
      }
    }
  };

  if (loading) return <div className="loading">Loading weekly plans...</div>;

  return (
    <div className="weeklyplan-container">
      <div className="weeklyplan-header">
        <div>
          <h1>Weekly Study Plan</h1>
          <p>Plan your academic week</p>
        </div>
        <button className="btn-add-exam" onClick={handleAddClick}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Plan
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="empty-state">
          <p>No weekly plans yet</p>
        </div>
      ) : (
        <div className="plans-list">
          {plans.map(plan => (
            <div key={plan.id} className="plan-card">
              <div className="plan-header">
                <h3>Week of {new Date(plan.week_start).toLocaleDateString()}</h3>
              </div>
              <p className="plan-description">{plan.description}</p>
              <div className="plan-actions">
                <button className="btn-sm edit" onClick={() => handleEditClick(plan)}>Edit</button>
                <button className="btn-sm delete" onClick={() => handleDelete(plan.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editId ? 'Edit Weekly Plan' : 'Add Weekly Plan'}</h2>
              <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Week Start Date *</label>
                <input
                  type="date"
                  value={formData.week_start}
                  onChange={(e) => setFormData({ ...formData, week_start: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Plan Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your plan for this week"
                  rows="6"
                  required
                />
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

export default WeeklyPlan;
